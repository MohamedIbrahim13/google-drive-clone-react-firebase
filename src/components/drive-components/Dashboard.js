import { Container } from "react-bootstrap"
import AddFolderButton from "./AddFolderButton"
import AddFileButton from "./AddFileButton"
import Folder from "./Folder"
import File from "./File"
import FolderBreadcrumbs from "./FolderBreadcrumbs"
import { useParams, useLocation, Redirect } from "react-router-dom"
import NavbarComp from "../Navbar"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useFolders } from "../../hooks/useFolders"

function Dashboard() {
  const {currentUser} = useContext(AuthContext);
  const {folderId} = useParams();
  const { state={} }= useLocation();
  const { folder, childFolders, childFiles } = useFolders(folderId,state.folder);
  if(!currentUser) return <Redirect to="/login"/>
  //console.log(folder,childFolders,childFiles);
  return (
    <>
      <NavbarComp/>
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs  currentFolder={folder}/>
          <AddFileButton  currentFolder={folder}/>
          <AddFolderButton  currentFolder={folder}/>
        </div>
        
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

export default Dashboard