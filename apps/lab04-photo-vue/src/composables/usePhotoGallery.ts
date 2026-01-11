import { ref, watch, onMounted } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
// เพิ่มการ Import สำหรับจัดการ Platform และ Path
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

export const usePhotoGallery = () => {
  const photos = ref<UserPhoto[]>([]);
  const PHOTO_STORAGE = 'photos';

  // ฟังก์ชันช่วยแปลง Blob เป็น Base64 (สำหรับ Web)
  const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  // ฟังก์ชันบันทึกรูปภาพลงในเครื่อง
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;

    // ตรวจสอบ Platform เพื่อเลือกวิธีอ่านไฟล์
    if (isPlatform('hybrid')) {
      // สำหรับ iOS และ Android: อ่านจาก Path โดยตรง
      const readFile = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = readFile.data as string;
    } else {
      // สำหรับ Web: ต้อง Fetch และแปลงเป็น Base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }

    // เขียนไฟล์ลงใน Storage ของเครื่อง
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform('hybrid')) {
      // สำหรับมือถือ: ใช้ Capacitor ในการแปลง Path ให้ Webview แสดงผลได้
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // สำหรับ Web: ใช้ webPath ปกติ
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const addNewToGallery = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    photos.value = [savedImageFile, ...photos.value];
  };

  const cachePhotos = () => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

    // ถ้าไม่ใช่บนมือถือ (คือบน Web) ต้องอ่านไฟล์มาเป็น Base64 เพื่อให้แสดงผลได้
    if (!isPlatform('hybrid')) {
      for (const photo of photosInPreferences) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }

    photos.value = photosInPreferences;
  };

  onMounted(loadSaved);
  watch(photos, cachePhotos);

  return {
    addNewToGallery,
    photos,
  };
};

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}