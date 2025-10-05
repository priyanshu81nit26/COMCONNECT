import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api.config";

const WorkspaceContext = createContext();

const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();
  const [userWorkspaces, setUserWorkspaces] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchUserWorkspaces = async () => {
      if (user?.token) {
        try {
          const response = await axios.get(
            `${API_URL}/workspace/user`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setUserWorkspaces(response.data);
        } catch (error) {
          console.error("Failed to fetch user workspaces:", error);
        }
      }
    };

    fetchUserWorkspaces();
  }, [user?.token]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        groups,
        setGroups,
        roles,
        setRoles,
        user,
        setUser,
        userWorkspaces,
        setUserWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);

export default WorkspaceProvider;
