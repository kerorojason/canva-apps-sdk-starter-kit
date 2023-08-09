import { Rows, Column, Columns, Placeholder } from '@canva/app-ui-kit';
import { addNativeElement } from '@canva/design';
import { upload } from '@canva/asset';
import React, { useEffect, useState, useMemo } from 'react';
import { enableMapSet, produce } from 'immer';
import styles from './meme_selector.css';

enableMapSet();

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
  const [isLoadedMap, setIsLoadedMap] = useState(new Map());

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((res) => {
        setMemes(res.data.memes);
      });
  }, []);

  const columns = useMemo(() => {
    if (!memes) {
      return undefined;
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

  const placeholders = useMemo(
    () => (
      <>
        {Array.from({ length: TOTAL_COLUMNS }).map((_, index) => (
          <Column key={index} width={`1/${TOTAL_COLUMNS}`}>
            <Rows spacing={SPACING}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Placeholder key={index} shape="square"></Placeholder>
              ))}
            </Rows>
          </Column>
        ))}
      </>
    ),
    []
  );

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

  const handleImageLoad = (meme) => {
    setIsLoadedMap(
      produce((draft) => {
        draft.set(meme.id, true);
      })
    );
  };

  return (
    <Columns spacing={SPACING}>
      {columns
        ? columns.map((column, index) => (
            <Column key={index} width={`1/${TOTAL_COLUMNS}`}>
              <Rows spacing={SPACING}>
                {column.map((meme) => {
                  const imageLoaded = isLoadedMap.get(meme.id);
                  return (
                    <>
                      <img
                        key={meme.id}
                        src={meme.url}
                        onClick={() => handleClick(meme)}
                        className={styles.image}
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                        onLoad={() => handleImageLoad(meme)}
                      />
                      {!imageLoaded && (
                        <div
                          style={{ aspectRatio: `${meme.width / meme.height}` }}
                        >
                          <Placeholder
                            key={`placeholder-${meme.id}`}
                            shape="rectangle"
                          />
                        </div>
                      )}
                    </>
                  );
                })}
              </Rows>
            </Column>
          ))
        : placeholders}
    </Columns>
  );
};

export default MemeSelector;
