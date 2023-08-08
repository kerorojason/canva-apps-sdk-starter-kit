import { Rows, Column, Columns } from '@canva/app-ui-kit';
import { addNativeElement } from '@canva/design';
import { upload } from '@canva/asset';
import React, { useEffect, useState, useMemo } from 'react';
import styles from './meme_selector.css';

const TOTAL_COLUMNS = 2;
const SPACING = '1u';

type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

const indexOfSmallest = (arr: number[]) => {
  let smallest = Infinity;
  let smallestIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < smallest) {
      smallest = arr[i];
      smallestIndex = i;
    }
  }
  return smallestIndex;
};

const MemeSelector = () => {
  const [memes, setMemes] = useState<Meme[]>();

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((res) => {
        setMemes(res.data.memes);
      });
  }, []);

  const columns = useMemo(() => {
    if (!memes) {
      return [];
    }
    const columns = Array.from({ length: TOTAL_COLUMNS }).map(
      () => [] as Meme[]
    );
    const heights = new Array<number>(TOTAL_COLUMNS).fill(0);
    for (const meme of memes) {
      const index = indexOfSmallest(heights);
      heights[index] += meme.height / meme.width;
      columns[index].push(meme);
    }
    return columns;
  }, [memes]);

  const handleClick = async ({ id, url }: Meme) => {
    const image = await upload({
      type: 'IMAGE',
      mimeType: 'image/jpeg',
      id,
      url,
      thumbnailUrl: url,
    });

    addNativeElement({
      type: 'IMAGE',
      ref: image.ref,
    });
  };

  return (
    <Columns spacing={SPACING}>
      {columns &&
        columns.map((column, index) => (
          <Column key={index} width={`1/${TOTAL_COLUMNS}`}>
            <Rows spacing={SPACING}>
              {column.map((meme) => (
                <img
                  key={meme.id}
                  src={meme.url}
                  onClick={() => handleClick(meme)}
                  className={styles.image}
                />
              ))}
            </Rows>
          </Column>
        ))}
    </Columns>
  );
};

export default MemeSelector;
