import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ProcessingResult, BackgroundOption } from '../types';
import { applyBackground } from './imageProcessor';

export async function downloadSingleFile(
  result: ProcessingResult, 
  backgroundOption: BackgroundOption = { type: 'transparent' }
) {
  try {
    const finalBlob = await applyBackground(result.resultBlob, backgroundOption);
    const filename = result.originalName.replace(/\.[^/.]+$/, '') + '_bgremoved.png';
    saveAs(finalBlob, filename);
  } catch (error) {
    console.error('Download failed:', error);
    // 폴백: 원본 다운로드
    const filename = result.originalName.replace(/\.[^/.]+$/, '') + '_bgremoved.png';
    saveAs(result.resultBlob, filename);
  }
}

export async function downloadAllAsZip(
  results: ProcessingResult[],
  _globalBackgroundOption: BackgroundOption = { type: 'transparent' } // 사용하지 않음 - 각 결과별 옵션 사용
) {
  const zip = new JSZip();
  const folder = zip.folder('bgcut_results');

  if (!folder) {
    console.error('Failed to create zip folder');
    return;
  }

  for (const result of results) {
    try {
      // 각 결과의 개별 배경 옵션 사용
      const bgOption = result.backgroundOption || { type: 'transparent' as const };
      const finalBlob = await applyBackground(result.resultBlob, bgOption);
      const filename = result.originalName.replace(/\.[^/.]+$/, '') + '_bgremoved.png';
      folder.file(filename, finalBlob);
    } catch (error) {
      console.error('Failed to process file for zip:', error);
      // 폴백: 원본 추가
      const filename = result.originalName.replace(/\.[^/.]+$/, '') + '_bgremoved.png';
      folder.file(filename, result.resultBlob);
    }
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const zipFilename = `bgcut_results_${timestamp}.zip`;

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipFilename);
}
