import { ArrowUpward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <IconButton
          size="large"
          sx={{ position: 'fixed', bottom: 60, right: 30 }}
          onClick={() => {
            if (typeof window !== 'undefined')
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <ArrowUpward />
        </IconButton>
        {children}
      </div>
    </>
  );
};
