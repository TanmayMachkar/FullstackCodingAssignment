"use client";

import axios from 'axios';
import { SignOutButton } from "@src/components/sign-out-button";
import { getAccountLinkStatus } from "@src/lib/auth/getAccountLinkStatusServerAction";
import { getUserName } from "@src/lib/auth/getUserNameServerAction";
import { getUserRole } from "@src/lib/auth/getUserRoleServerAction";
import { getImage } from "@src/lib/auth/getImageServerAction";
import { handleGoogleSignIn } from "@src/lib/auth/googleSignInServerAction";
import { unLinkGoogleAccount } from "@src/lib/auth/unlinkGoogleAccountServerAction";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const DashboardPage: React.FC = () => {
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [ fileUrl, setFileUrl ] = useState('');
  const { update } = useSession();

  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try{
      const fileData = new FormData();
      if (!file) {
        console.error("No file selected");
        return;
      }
      fileData.append("file", file);
      const responseData = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: fileData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
          'Content-Type': 'multipart/form-data'
        }
      })
      const fileUrl = 'https://gateway.pinata.cloud/ipfs/' + responseData.data.IpfsHash;
      setFileUrl(fileUrl);
      await update({ image: fileUrl });
      window.location.reload();
      console.log("Updated session image: ", fileUrl);
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const userInfo = async () => {
      const name = await getUserName();
      if (name) {
        setUsername(name);
      }

      const image = await getImage();
      if (image) {
        setFileUrl(image);
        console.log(fileUrl);
      }

      const role = await getUserRole();
      if (role) {
        setRole(role);
      }
    };
    const accountLinkStatus = async () => {
      try {
        const accountLinkStatus = await getAccountLinkStatus();
        setIsAccountLinked(accountLinkStatus);
      } catch (error) {
        console.error("Failed to get account link status:", error);
      }
    };
    userInfo();
    accountLinkStatus();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <div className="dashboard-card">
        <a href="/admin">Go to Admin Page</a>
        <div>
          <p>Role: {role}</p>
        </div>
        <div className="name">{username}</div>
        <div className="field-input-container">
          <input
            className="field-input"
            type="text"
            placeholder={"Enter name"}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button
            className="update-field-button"
            onClick={() => update({ name: username })}
          >
            Update Name
          </button>
        </div>
        <div>
          <button
            className="link-account-button"
            onClick={
              isAccountLinked
                ? async () => {
                    await unLinkGoogleAccount().then(() => {
                      setIsAccountLinked(false);
                    });
                  }
                : async () => {
                    await handleGoogleSignIn().then(() => {
                      setIsAccountLinked(true);
                    });
                  }
            }
          >
            {isAccountLinked
              ? "Disconnect Google Account"
              : "Connect Google Account"}
          </button>
        </div>
        <div>
          <SignOutButton className="signout-button" />
        </div>
        <div className="profile-update-section">
          <h3>Update Profile Image</h3>
          <div className="upload-container">
            <label className="file-input-label">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
                accept="image/png,image/jpeg"
                className="file-input"
              />
              Choose File
            </label>
            <button 
              type="submit" 
              onClick={handleSubmit} 
              className="upload-button"
            >
              📤 Upload
            </button>
          </div>
          {fileUrl && (
            <div className="uploaded-container">
              <p>Updated Profile Image:</p>
              <img 
                src={fileUrl} 
                alt="Uploaded"
                className="uploaded-image" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};