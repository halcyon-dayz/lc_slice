import React from "react";
import interact from "interactjs";
import {InteractEvent} from "@interactjs/core/InteractEvent"

export const dragRefWithItself = (
    draggedRef: React.RefObject<HTMLElement>
) => {
    dragRefWith(draggedRef, draggedRef);
}

export const dragRefWith = (
    draggedRef: React.RefObject<HTMLElement>, 
    draggedWith: React.RefObject<HTMLElement>,
): void => {
    if (!draggedRef.current || !draggedWith.current) {
      return;
    } 
    console.log("reffed")
    interact(draggedWith.current).draggable({
      maxPerElement: 10,
        listeners: {
          start(event) {

          },
          move(event: InteractEvent) {
            if (draggedRef.current) {
              const leftInt = parseInt(draggedRef.current.style.left.slice(0, -2))
              const topInt = parseInt(draggedRef.current.style.top.slice(0, -2))
              draggedRef.current.style.left = leftInt + event.dx + 'px';
              draggedRef.current.style.top = topInt + event.dy + 'px';
            }
          },
          
        }, 
    })
}