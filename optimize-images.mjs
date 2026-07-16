import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = './images';

// Imagens do curso (muito pesadas, precisam de compressão agressiva)
const COURSE_IMAGES = [
  'lisi-viezzer-fotografa.webp',
  'lisi-viezzer-gravando-curso-fotografia.webp',
  'direcao-de-modelo-ensaio-externo.webp',
  'fotografia-arquitetura-enquadramento-linhas.webp',
  'aula-fotografia-estudio-manual.webp',
  'aula-pratica-curso-fotografia-lisi-viezzer.webp',
  'curso-de-fotografia-online.webp',
  'fotografia-espontanea-captura-de-momentos.webp',
  'gravacao-curso-fotografia-do-zero.webp',
  'ensaio-fotografico-moda-velocidade-obturador.webp',
  'fotografia-lifestyle-luz-natural.webp',
  'composicao-enquadramento-fotografia-viagem.webp',
  'velocidade-obturador-curso-fotografia.webp',
  'configuracao-camera-iso-abertura-velocidade.webp',
];

// Depoimentos (já leves, só reprocessa para garantir)
const TESTIMONIAL_IMAGES = [
  'depoimento_01.webp',
  'depoimento_02.webp',
  'depoimento_03.webp',
  'depoimento_04.webp',
  'depoimento_05.webp',
  'depoimento_06.webp',
  'depoimento_07.webp',
  'depoimento_08.webp',
  'depoimento_09.webp',
];

async function getSize(filepath) {
  const s = await stat(filepath);
  return (s.size / 1024).toFixed(1);
}

async function optimizeImage(filename, maxWidth, quality) {
  const input  = join(IMAGES_DIR, filename);
  const output = join(IMAGES_DIR, '_opt_' + filename);

  const before = await getSize(input);

  await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);

  const after = await getSize(output);
  const saved = (((before - after) / before) * 100).toFixed(0);

  // Substitui o original
  await rename(output, input);

  console.log(`✅ ${filename}: ${before}KB → ${after}KB (${saved}% menor)`);
}

async function main() {
  console.log('\n=== Otimizando imagens do curso ===');
  for (const img of COURSE_IMAGES) {
    try {
      await optimizeImage(img, 1400, 78);
    } catch (e) {
      console.warn(`⚠️  ${img}: ${e.message}`);
    }
  }

  console.log('\n=== Verificando depoimentos ===');
  for (const img of TESTIMONIAL_IMAGES) {
    try {
      await optimizeImage(img, 900, 82);
    } catch (e) {
      console.warn(`⚠️  ${img}: ${e.message}`);
    }
  }

  console.log('\n✨ Otimização concluída!\n');
}

main();
