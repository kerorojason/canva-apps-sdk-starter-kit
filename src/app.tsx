import { Rows, Text } from '@canva/app-ui-kit';
import { addNativeElement } from '@canva/design';
import { upload } from '@canva/asset';
import React, { useEffect, useState } from 'react';
import styles from 'styles/components.css';

type Meme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions: number;
};

export const App = () => {
  const [memes, setMemes] = useState<Meme[]>();

  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((res) => {
        setMemes(res.data.memes);
      });
  }, []);

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
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          To make changes to this app, edit the{' '}
          <code className={styles.code}>src/app.tsx</code> file, then close and
          reopen the app in the editor to preview the changes.
        </Text>
        {memes &&
          memes.map((meme) => (
            <div key={meme.id}>
              <p>{meme.name}</p>
              <img src={meme.url} onClick={() => handleClick(meme)}></img>
            </div>
          ))}
      </Rows>
    </div>
  );
};
