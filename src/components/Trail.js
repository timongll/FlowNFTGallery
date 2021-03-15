import React from "react";
import { useTrail, animated, interpolate } from "react-spring";

const styles = {
     zIndex: "auto",
};

const Trail = ({ children, ...props }) => {
  const items = React.Children.toArray(children);
  const trail = useTrail(items.length, {
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0 },
  });
  return (
    <>
      {trail.map(({ y, ...rest }, index) => (
        <animated.div
          //@ts-ignore
          key={items[index].key}
          style={{
            ...rest,
            ...styles,
            transform: interpolate([y], (y) => `translate(0,${y}px)`),
          }}
        >
          {items[index]}
        </animated.div>
      ))}
    </>
  );
};

export default Trail;
