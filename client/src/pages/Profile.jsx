import { useState } from "react";
import {
  User,
  Mail,
  AtSign,
  Pencil,
  LockKeyhole,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import { profileFields } from "../utils/fieldsFormat";

export default function Profile() {
  // Temporary data until authentication/profile API is implemented
  const [user, setUser] = useState({
    firstName: "Ahmed",
    secondName: "Mohamed",
    username: "ahmed_mohamed",
    email: "ahmed@example.com",
  });

  const [profileFormData, setProfileFormData] = useState(user);

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isDeleteAccount, setIsDeleteAccount] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fullName = `${user.firstName} ${user.secondName}`;

  const getInitials = () => {
    return `${user.firstName?.[0] || ""}${
      user.secondName?.[0] || ""
    }`.toUpperCase();
  };

  const handleOpenEditProfile = () => {
    setProfileFormData({
      firstName: user.firstName,
      secondName: user.secondName,
      username: user.username,
      email: user.email,
    });

    setModalError("");
    setIsEditProfile(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;

    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setModalError("");

    try {
      // Later:
      // const res = await updateProfile(profileFormData);
      // setUser(res.data.data);

      setUser(profileFormData);
      setIsEditProfile(false);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteAccount = () => {
    setModalError("");
    setIsDeleteAccount(true);
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    setModalError("");

    try {
      // Later:
      // await deleteAccount();

      setIsDeleteAccount(false);
    } catch (err) {
      setModalError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-main-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main">Profile</h1>

          <p className="mt-1 text-sm text-text-secondary">
            Manage your account information and preferences
          </p>
        </div>

        {/* PROFILE CARD */}
        <section className="overflow-hidden rounded-2xl border border-border-light bg-surface shadow-sm">
          {/* PROFILE HEADER */}
          <div className="border-b border-border-light px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* AVATAR */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-sm">
                {getInitials()}
              </div>

              {/* NAME */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-main">{fullName}</h2>

                <p className="mt-1 text-sm text-text-secondary">
                  @{user.username}
                </p>
              </div>

              {/* EDIT ACCOUNT */}
              <button
                type="button"
                onClick={handleOpenEditProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-light bg-surface px-4 py-2.5 text-sm font-semibold text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit Account
              </button>
            </div>
          </div>

          {/* ACCOUNT INFORMATION */}
          <div className="px-6 py-6 sm:px-8">
            <div className="mb-5">
              <h3 className="text-base font-bold text-text-main">
                Account Information
              </h3>

              <p className="mt-1 text-xs text-text-secondary">
                Your basic account information
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* FIRST NAME */}
              <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-text-secondary" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    First Name
                  </span>
                </div>

                <p className="text-sm font-semibold text-text-main">
                  {user.firstName}
                </p>
              </div>

              {/* SECOND NAME */}
              <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-text-secondary" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Second Name
                  </span>
                </div>

                <p className="text-sm font-semibold text-text-main">
                  {user.secondName}
                </p>
              </div>

              {/* USERNAME */}
              <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-text-secondary" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Username
                  </span>
                </div>

                <p className="text-sm font-semibold text-text-main">
                  @{user.username}
                </p>
              </div>

              {/* EMAIL */}
              <div className="rounded-xl border border-border-light bg-main-bg/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-secondary" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Email
                  </span>
                </div>

                <p className="break-all text-sm font-semibold text-text-main">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* ACCOUNT SETTINGS */}
          <div className="border-t border-border-light px-6 py-6 sm:px-8">
            <div className="mb-4">
              <h3 className="text-base font-bold text-text-main">
                Account Settings
              </h3>

              <p className="mt-1 text-xs text-text-secondary">
                Manage your account security
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* EDIT ACCOUNT */}
              <button
                type="button"
                onClick={handleOpenEditProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-light px-4 py-2.5 text-sm font-semibold text-text-main hover:bg-main-bg transition-colors cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit Account
              </button>

              {/* CHANGE PASSWORD */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-light px-4 py-2.5 text-sm font-semibold text-text-main hover:bg-main-bg transition-colors cursor-pointer"
              >
                <LockKeyhole className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-5 w-5 text-error" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-main">
                  Danger Zone
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-secondary">
                  Deleting your account is permanent. All account-related data
                  may be removed and this action cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenDeleteAccount}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-surface px-4 py-2.5 text-sm font-semibold text-error hover:bg-red-50 hover:border-error transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* EDIT ACCOUNT MODAL */}
      {isEditProfile && (
        <Modal
          title="Edit Account"
          description="Update your account information."
          fields={profileFields}
          setIsModalOpen={setIsEditProfile}
          handleSubmit={handleEditProfileSubmit}
          isSubmitting={isSubmitting}
          handleInputChange={handleProfileInputChange}
          formData={profileFormData}
          submitLabel="Update Account"
          modalError={modalError}
        />
      )}

      {/* DELETE ACCOUNT MODAL */}
      {isDeleteAccount && (
        <ConfirmationModal
          title="Delete Account"
          description="Are you sure you want to delete your account? This action is permanent and cannot be undone."
          setIsModalOpen={setIsDeleteAccount}
          handleConfirm={handleDeleteAccount}
          isSubmitting={isSubmitting}
          confirmLabel="Delete Account"
          modalError={modalError}
        />
      )}
    </main>
  );
}
