import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enqueueAction } from "./actions";

const CollisionDetector = ({ sprites }) => {
  const dispatch = useDispatch();
  const spriteStates = useSelector((state) => state.sprites || {});

  useEffect(() => {
    const checkCollisions = () => {
      const spriteIds = Object.keys(spriteStates);

      for (let i = 0; i < spriteIds.length; i++) {
        for (let j = i + 1; j < spriteIds.length; j++) {
          const sprite1 = document.getElementById(`character-${spriteIds[i]}`);
          const sprite2 = document.getElementById(`character-${spriteIds[j]}`);

          if (sprite1 && sprite2) {
            const rect1 = sprite1.getBoundingClientRect();
            const rect2 = sprite2.getBoundingClientRect();

            if (
              rect1.left < rect2.right &&
              rect1.right > rect2.left &&
              rect1.top < rect2.bottom &&
              rect1.bottom > rect2.top
            ) {
              // Collision detected - swap animations
              const queue1 = spriteStates[spriteIds[i]]?.queue || [];
              const queue2 = spriteStates[spriteIds[j]]?.queue || [];

              if (queue1.length > 0 && queue2.length > 0) {
                // Find the first move action in each queue
                const moveAction1 = queue1.find((action) =>
                  action.startsWith("move_")
                );
                const moveAction2 = queue2.find((action) =>
                  action.startsWith("move_")
                );

                if (moveAction1 && moveAction2) {
                  // Swap the directions
                  const newAction1 = moveAction1.includes("right")
                    ? moveAction1.replace("right", "left")
                    : moveAction1.replace("left", "right");

                  const newAction2 = moveAction2.includes("right")
                    ? moveAction2.replace("right", "left")
                    : moveAction2.replace("left", "right");

                  // Create new queues with swapped actions
                  const newQueue1 = queue1.map((action) =>
                    action === moveAction1 ? newAction2 : action
                  );
                  const newQueue2 = queue2.map((action) =>
                    action === moveAction2 ? newAction1 : action
                  );

                  // Dispatch actions to update the queues
                  dispatch({
                    type: "SWAP_ANIMATIONS",
                    payload: {
                      spriteId1: spriteIds[i],
                      queue1: newQueue1,
                      spriteId2: spriteIds[j],
                      queue2: newQueue2,
                    },
                  });
                }
              }
            }
          }
        }
      }
    };

    const interval = setInterval(checkCollisions, 100);
    return () => clearInterval(interval);
  }, [dispatch, spriteStates, sprites]);

  return null;
};

export default CollisionDetector;
