import { useState } from "react";
import "./FormProfile.css";

interface Profile {
    fullName: string;
    email: string;
    birthDate: string;
    accountType: "Personal" | "Bussiness";
    companyName: string;
    role: string;
    customRole: string;
    newsletter: boolean;
    frequency: string;
}

const initialProfile: Profile = {
    fullName: "",
    email: "",
    birthDate: "",
    accountType: "Personal",
    companyName: "",
    role: "Developer",
    customRole: "",
    newsletter: false,
    frequency: "Every week"
};

function getErrors(profile: Profile) {
    const errors: Record<string, string> = {};

    if (profile.fullName.trim().length < 3) {
        errors.fullName = "Enter at least 3 symbols pls";
    }

    if (!profile.email.trim()) {
        errors.email = "Email is necessary";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        errors.email = "Enter correct Email";
    }

    if (!profile.birthDate) {
        errors.birthDate = "Enter birth date";
    } else {
        const today = new Date();
        const birthDate = new Date(profile.birthDate + "T00:00:00");
        const adultDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );

        if (birthDate > today || birthDate > adultDate) {
            errors.birthDate = "U`re age needs to be at least 18 yrs old";
        }
    }

    if (
        profile.accountType === "Bussiness" &&
        !profile.companyName.trim()
    ) {
        errors.companyName = "Enter company name";
    }

    if (profile.role === "Other" && !profile.customRole.trim()) {
        errors.customRole = "Enter ur role";
    }

    return errors;
}

export default function ProfileForm() {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState(false);

    const errors = getErrors(profile);
    const isValid = Object.keys(errors).length === 0;

    function updateProfile(field: keyof Profile, value: string | boolean) {
        setProfile(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    }

    function showError(field: string) {
        return touched[field] && errors[field];
    }

    function handleBlur(field: string) {
        setTouched(prev => ({ ...prev, [field]: true }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setTouched({
            fullName: true,
            email: true,
            birthDate: true,
            companyName: true,
            customRole: true
        });

        if (isValid) {
            setSaved(true);
            console.log("Saved profile:", profile);
        }
    }

    function handleReset() {
        setProfile({ ...initialProfile });
        setTouched({});
        setSaved(false);
    }

    return (
        <div className="profilePage">
            <form className="profileForm" onSubmit={handleSubmit}>
                <h2>Edit profile</h2>

                <label>Full Name</label>
                <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => updateProfile("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Tom Ford"
                />
                {showError("fullName") && <p className="error">{errors.fullName}</p>}

                <label>Email</label>
                <input
                    type="email"
                    value={profile.email}
                    onChange={e => updateProfile("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="urmail@email.com"
                />
                {showError("email") && <p className="error">{errors.email}</p>}

                <label>Birth Date</label>
                <input
                    type="date"
                    value={profile.birthDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={e => updateProfile("birthDate", e.target.value)}
                    onBlur={() => handleBlur("birthDate")}
                />
                {showError("birthDate") && <p className="error">{errors.birthDate}</p>}

                <label>Account type</label>
                <select
                    value={profile.accountType}
                    onChange={e => updateProfile("accountType", e.target.value)}
                >
                    <option value="Personal">Personal</option>
                    <option value="Bussiness">Bussiness</option>
                </select>

                {profile.accountType === "Bussiness" && (
                    <>
                        <label>Company Name</label>
                        <input
                            type="text"
                            value={profile.companyName}
                            onChange={e => updateProfile("companyName", e.target.value)}
                            onBlur={() => handleBlur("companyName")}
                            placeholder="Company name"
                        />
                        {showError("companyName") && (
                            <p className="error">{errors.companyName}</p>
                        )}
                    </>
                )}

                <label>Role</label>
                <select
                    value={profile.role}
                    onChange={e => updateProfile("role", e.target.value)}
                >
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Manager</option>
                    <option>Other</option>
                </select>

                {profile.role === "Other" && (
                    <>
                        <label>Enter role</label>
                        <input
                            type="text"
                            value={profile.customRole}
                            onChange={e => updateProfile("customRole", e.target.value)}
                            onBlur={() => handleBlur("customRole")}
                            placeholder="Ur role"
                        />
                        {showError("customRole") && (
                            <p className="error">{errors.customRole}</p>
                        )}
                    </>
                )}

                <label className="checkboxLabel">
                    <input
                        type="checkbox"
                        checked={profile.newsletter}
                        onChange={e => updateProfile("newsletter", e.target.checked)}
                    />
                    accept mailing
                </label>

                {profile.newsletter && (
                    <>
                        <label>Mailing frequency</label>
                        <select
                            value={profile.frequency}
                            onChange={e => updateProfile("frequency", e.target.value)}
                        >
                            <option>Daily</option>
                            <option>Weekly</option>
                        </select>
                    </>
                )}

                <div className="formButtons">
                    <button type="submit" disabled={!isValid}>
                        Save
                    </button>
                    <button type="button" onClick={handleReset}>
                        Cancel
                    </button>
                </div>

                {saved && <p className="success">Profile saved successfully!</p>}
            </form>

            <div className="livePreview">
                <h2>Live Preview</h2>
                <p><strong>Full name:</strong> {profile.fullName || "—"}</p>
                <p><strong>Email:</strong> {profile.email || "—"}</p>
                <p><strong>Birth date:</strong> {profile.birthDate || "—"}</p>
                <p><strong>Account type:</strong> {profile.accountType}</p>

                {profile.accountType === "Bussiness" && (
                    <p><strong>Company name:</strong> {profile.companyName || "—"}</p>
                )}

                <p>
                    <strong>Role:</strong>{" "}
                    {profile.role === "Other"
                        ? profile.customRole || "Other role"
                        : profile.role}
                </p>

                <p>
                    <strong>Mailing:</strong>{" "}
                    {profile.newsletter ? "Turned on" : "Turned off"}
                </p>

                {profile.newsletter && (
                    <p><strong>Frequency:</strong> {profile.frequency}</p>
                )}

                <p>
                    <strong>Status:</strong>{" "}
                    {isValid ? "Correct data" : "There are empty or incorrect fields"}
                </p>
            </div>
        </div>
    );
}
