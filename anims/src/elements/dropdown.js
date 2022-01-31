import React from 'react';
import Button from 'elements/button';
import { colors } from 'utils';
import { useLayer } from 'react-laag';

const DropdownLayer = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        background: colors.black,
        border: '1px solid ' + colors.white,
        boxShadow: '0px 0px 15px 5px #000000',
        // padding: '16px',
      }}
    >
      {props.children}
    </div>
  );
});

export const Dropdown = props => {
  const children = props.children;
  const buttonText = props.buttonText;
  const style = props.style ?? {};

  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen: optionsOpen,
    placement: 'right-start',
    triggerOffset: 8,
    arrowOffset: 4,
    onOutsideClick: () => setOptionsOpen(false),
  });
  return (
    <>
      <Button
        {...triggerProps}
        type="secondary"
        style={style}
        onClick={() => setOptionsOpen(!optionsOpen)}
      >
        {buttonText ?? <span>≡</span>}
      </Button>
      {optionsOpen &&
        renderLayer(
          <DropdownLayer {...layerProps} arrowProps={arrowProps}>
            {children}
          </DropdownLayer>
        )}
    </>
  );
};
