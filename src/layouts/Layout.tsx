import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from '@mui/material/IconButton';
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
          <ArrowUpwardIcon />
        </IconButton>
        {children}
      </div>
    </>
  );
};
