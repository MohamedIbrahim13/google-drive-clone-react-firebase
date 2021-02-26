import { useReducer, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";

const ACTIONS = {
  SELECT_FOLDER: "SELECT_FOLDER",
  UPDATE_FOLDER: "UPDATE_FOLDER",
  SET_CHILD_FOLDERS: "SET_CHILD_FOLDERS",
  SET_CHILD_FILES: "SET_CHILD_FILES",
};

export const ROOT_FOLDER = { name: "Root", id: null, path: [] }

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      };
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      };
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      };
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      };
    default:
      return state;
  }
}

export function useFolders(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
  }, [folder, folderId]);

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }
    db.folders
      .doc(folderId)
      .get()
      .then((doc) => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: db.formatDoc(doc) },
        });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
      });
  }, [folderId]);

  useEffect(() => {
    const cleanup = db.folders
      .where("parentId", "==", folderId)
      .where("userId", "==", currentUser.uid)
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        dispatch({
          type: ACTIONS.SET_CHILD_FOLDERS,
          payload: { childFolders: snap.docs.map(db.formatDoc) },
        });
      });

    return () => cleanup();
  }, [folderId, currentUser]);

  useEffect(() => {
    const cleanup = db.files
        .where("folderId", "==", folderId)
        .where("userId", "==", currentUser.uid)
        .orderBy("createdAt")
        .onSnapshot(snapshot => {
          dispatch({
            type: ACTIONS.SET_CHILD_FILES,
            payload: { childFiles: snapshot.docs.map(db.formatDoc) },
          })
        })

    return () => cleanup();
  }, [folderId, currentUser]);

  return state;
}
