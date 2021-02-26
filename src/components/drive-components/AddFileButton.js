import ReactDOM from "react-dom";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuidV4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";
import { ROOT_FOLDER } from "../../hooks/useFolders";
import { db, storage } from "../../firebaseConfig";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function AddFileButton({ currentFolder }) {
  const [uploading, setUploading] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;
    const id = uuidV4();
    setUploading((prevState) => [
      ...prevState,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;
    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploading((prevState) => {
          return prevState.map((uploadedFile) => {
            if (uploadedFile.id === id) {
              return { ...uploadedFile, progress: progress };
            }
            return uploadedFile;
          });
        });
      },
      () => {
        setUploading((prevState) => {
          return prevState.map((uploadedFile) => {
            if (uploadedFile.id === id) {
              return { ...uploadedFile, error: true };
            }
            return uploadedFile;
          });
        });
      },
      () => {
        setUploading((prevState) => {
          return prevState.filter((uploadedFile) => {
            return uploadedFile.id !== id;
          });
        });

        uploadTask.snapshot.ref.getDownloadURL().then(url => {
          db.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then(existingFiles => {
              const existingFile = existingFiles.docs[0]
              if (existingFile) {
                existingFile.ref.update({ url: url })
              } else {
                db.files.add({
                  url: url,
                  name: file.name,
                  createdAt: db.currentTimeStamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                })
              }
            })
        })
      }
    );
  };
  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploading.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploading.map((file) => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploading((prevState) => {
                    return prevState.filter((uploadedFile) => {
                      return uploadedFile.id !== file.id;
                    });
                  });
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

export default AddFileButton;
