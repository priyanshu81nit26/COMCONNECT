import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import { useWorkspace } from "../../Context/WorkspaceProvider";
import { useNavigate } from "react-router-dom";
import { workspace } from "../../utils/media/media";
import "./workspace.css";
import { API_URL } from "../../config/api.config";

const CreateWorkspaceModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [emails, setEmails] = useState("");
  const { user } = useWorkspace();
  const [workspaceId, setWorkspaceId] = useState(null);
  const navigate = useNavigate();

  const token =
    user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;

  const createWorkspace = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/workspace`,
        { name: workspaceName, roles },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Workspace created:", response.data);
      setWorkspaceId(response.data.workspace._id);
      setStep(2);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/workspace/${workspaceId}/roles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoleList(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const sendInvitation = (email, role) => {
    const templateParams = {
      to_email: email,
      workspace_id: workspaceId,
      workspace_name: workspaceName,
      role_name: role,
      portal_link: "http://your-portal-link.com",
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
        },
        (error) => {
          console.error("Error sending email:", error.text);
        }
      );
  };

  const inviteUsers = () => {
    const emailsArray = emails.split(",").map((email) => email.trim());
    emailsArray.forEach((email) => sendInvitation(email, selectedRole));
  };

  useEffect(() => {
    if (step === 2 && workspaceId) {
      fetchRoles();
    }
  }, [step, workspaceId]);

  const handleDone = () => {
    navigate(`/workspace/${workspaceId}/chats`);
  };

  const [showPopup, setShowPopup] = useState(false);

  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  const handleCreateWorkspace = () => {
    setShowCreateWorkspace(true);
  };

  const handleClose = () => {
    setShowCreateWorkspace(false);
  };

  return (
    <div className="workspace_page">
      {showPopup && (
        <div className="popup">
          <h2>Workspace Created!</h2>
          <p>Your workspace has been successfully created.</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
      <div className="workspace_display">
        <div className="workspace_content">
          <div className="workspace_content_heading">
            Create a new ComConnect Workspace

            
              <button
                className="create_workspace_btn"
                onClick={handleCreateWorkspace}
              >
                Create Workspace
              </button>
          
          </div>
          
          <div className="workspace_content_description">
            Introducing ComConnect: Revolutionizing college communities by
            connecting students, allocating roles based on preferences, and
            creating teams that feel like family. Empower collaboration and
            enhance productivity with comConnect! to create a workspace click on
            the button below
    
          </div>
        </div>
        <div className="workspace_img_container">
          <img className="workspace_img" src="/images/workspace.png" alt="workspace" />
        </div>
      </div>
      {showCreateWorkspace && (
        <div className="modal_background">
          <div className="modal">
            <div className="modal_content">
              {step === 1 && (
                <div>
                  <h2>Create Workspace</h2>
                  <div className="workspace_holder">
                    <div className="input-group">
                      <label htmlFor="workspaceName">Workspace Name</label>
                      <input
                        id="workspaceName"
                        type="text"
                        placeholder="Workspace Name"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="addRole">Add Role</label>
                      <input
                        id="addRole"
                        type="text"
                        placeholder="Add Role"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setRoles([...roles, e.target.value]);
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                    <div className="input-group">
                      <label>Role List</label>
                      <div className="role-container">
                        <ol className="iskima">
                          {roles.map((role, index) => (
                            <li className="role-item" key={index}>
                              {role}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="workspace_btn">
                    <button onClick={createWorkspace}>Next</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2>Invite Users</h2>
                  <ul>
                    {roleList.map((role, index) => (
                      <li key={index}>
                        {role.roleName}{" "}
                        <button onClick={() => setSelectedRole(role.roleName)}>
                          Invite
                        </button>
                      </li>
                    ))}
                  </ul>
                  {selectedRole && (
                    <div>
                      <h3>Invite Users to {selectedRole}</h3>
                      <input
                        type="text"
                        placeholder="Enter emails separated by commas"
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                      />
                      <button onClick={inviteUsers}>Send Invitations</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal_button">
              <button onClick={handleClose}>Close</button>
              <button onClick={handleDone}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWorkspaceModal;
