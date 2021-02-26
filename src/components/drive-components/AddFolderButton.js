import { useState, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import { ROOT_FOLDER } from "../../hooks/useFolders";

function AddFolderButton({currentFolder}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { currentUser } = useContext(AuthContext);
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentFolder == null) return;

    const path = [...currentFolder.path]
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id })
    }

    db.folders.add({
      name:name,
      parentId: currentFolder.id,
      path:path,
      userId: currentUser.uid,
      createdAt: db.currentTimeStamp(),
    });
    setName("");
    closeModal();
  };
  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddFolderButton;
