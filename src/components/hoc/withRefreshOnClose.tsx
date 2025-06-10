import React from 'react';

interface WithRefreshProps {
  isOpen: boolean;
  onClose: () => void;
}

export function withRefreshOnClose<P extends WithRefreshProps>(WrappedComponent: React.ComponentType<P>) {
  return function WithRefreshOnCloseComponent(props: P) {
    const handleClose = () => {
      props.onClose();
      window.location.reload();
    };

    return (
      <WrappedComponent
        {...props}
        onClose={handleClose}
      />
    );
  };
} 