import { useState, useCallback } from 'react';
import { DoodlePath } from '../types/doodle';

const MAX_UNDO_DEPTH = 50;

export function useDrawingHistory(initialPaths: DoodlePath[] = []) {
  const [paths, setPaths] = useState<DoodlePath[]>(initialPaths);
  const [undoStack, setUndoStack] = useState<DoodlePath[][]>([]);
  const [redoStack, setRedoStack] = useState<DoodlePath[][]>([]);

  const addPath = useCallback((newPath: DoodlePath) => {
    setPaths((prev) => {
      setUndoStack((u) => {
        const nextStack = [...u, prev];
        if (nextStack.length > MAX_UNDO_DEPTH) {
          return nextStack.slice(nextStack.length - MAX_UNDO_DEPTH);
        }
        return nextStack;
      });
      setRedoStack([]); // clear redo stack on new action
      return [...prev, newPath];
    });
  }, []);

  const undo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const previousState = prevUndo[prevUndo.length - 1];
      const newUndo = prevUndo.slice(0, prevUndo.length - 1);

      setPaths((currentPaths) => {
        setRedoStack((prevRedo) => [...prevRedo, currentPaths]);
        return previousState;
      });

      return newUndo;
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const nextState = prevRedo[prevRedo.length - 1];
      const newRedo = prevRedo.slice(0, prevRedo.length - 1);

      setPaths((currentPaths) => {
        setUndoStack((prevUndo) => [...prevUndo, currentPaths]);
        return nextState;
      });

      return newRedo;
    });
  }, []);

  const clearCanvas = useCallback(() => {
    setPaths((currentPaths) => {
      if (currentPaths.length === 0) return currentPaths;
      setUndoStack((prevUndo) => [...prevUndo, currentPaths]);
      setRedoStack([]);
      return [];
    });
  }, []);

  const loadPaths = useCallback((newPaths: DoodlePath[]) => {
    setPaths(newPaths);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    paths,
    addPath,
    undo,
    redo,
    clearCanvas,
    loadPaths,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}

