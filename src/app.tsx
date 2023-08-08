import { Rows, Text } from '@canva/app-ui-kit';
import MemeSelector from './meme_selector';
import React from 'react';
import styles from 'styles/components.css';

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>To make changes to this app, edit the</Text>
        <MemeSelector />
      </Rows>
    </div>
  );
};
