import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
// เพิ่มการ Import สำหรับ Mobile
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const PHOTO_STORAGE = 'photos';

  // --- ส่วนที่ 1: โหลดรูปภาพเมื่อเปิดแอป ---
  useEffect(() => {
    const loadSaved = async () => {
      const { value: photoList } = await Preferences.get({ key: PHOTO_STORAGE });
      const photosInPreferences = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

      // ถ้าทำงานบนเว็บ (ไม่ใช่ hybrid) ต้องอ่านไฟล์เป็น base64
      if (!isPlatform('hybrid')) {
        for (const photo of photosInPreferences) {
          const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
      }

      setPhotos(photosInPreferences);
    };

    loadSaved();
  }, []);

  // --- ส่วนที่ 2: ฟังก์ชันช่วยแปลงไฟล์สำหรับเว็บ ---
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

  // --- ส่วนที่ 3: ฟังก์ชันบันทึกรูปภาพ (แยก Web และ Mobile) ---
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string | Blob;

    // เช็คแพลตฟอร์ม
    if (isPlatform('hybrid')) {
      // ถ้าเป็นมือถือ: อ่านไฟล์โดยตรงจาก path
      const readFile = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = readFile.data;
    } else {
      // ถ้าเป็นเว็บ: ต้อง fetch และแปลงเป็น base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform('hybrid')) {
      // สำหรับมือถือ: ใช้ convertFileSrc เพื่อแสดงผลรูปภาพจากไฟล์ระบบ
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // สำหรับเว็บ: ใช้ webPath เดิมแสดงผล
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  // --- ส่วนที่ 4: ฟังก์ชันหลักสำหรับถ่ายรูป ---
  const addNewToGallery = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    const newPhotos = [savedImageFile, ...photos];
    setPhotos(newPhotos);

    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos),
    });
  };

  return {
    photos,
    addNewToGallery,
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}