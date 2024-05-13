import React, { useRef, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export default function UpdateProfile({ activeComponent, setActiveComponent }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  // Update
  const updateStreetRef = useRef();
  const updateCityRef = useRef();
  const updatePostcodeRef = useRef();
  const updateCountryRef = useRef();
  const updateBusinessNumberRef = useRef();
  const updateVATregRef = useRef();
  const updateCompanyLogo = useRef();
  const photoInputForm = useRef();

  const { checkUser, updateUserPassword, updateUserEmail, logout } = useAuth();

  const currentUser = checkUser();

  const blankForm = {};

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState(blankForm);
  const [userInfo, setUserInfo] = useState([]);
  const [logoState, setLogoState] = useState("without-logo");
  const [logo, setLogo] = useState(<h2 className="company-logo">logo</h2>);

  const navigate = useNavigate();

  const storage = getStorage();

  const getCurrentUserInfo = () => {
    const userInfoRef = doc(db, "users", currentUser.email);
    onSnapshot(userInfoRef, (snapshot) => {
      const currentUserInfo = snapshot.data();
      setUserInfo(currentUserInfo);
      if (userInfo.logo) {
        setLogoState("with-logo");
        setLogo(<img src={userInfo.logo} alt="logo" className="logo-img" />);
      } else {
        setLogoState("without-logo");
        setLogo(<h2 className="company-logo">logo</h2>);
      }
    });
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.log(e);
      setError("Failed to log out");
    }
  };

  const postFormData = async (data) => {
    await setDoc(doc(db, "users", currentUser.email), { ...data }, { merge: true });
  };

  const emailPassChange = async () => {
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to update account");
        // switch(err){
        // 	case err.contains('requires-recenent-login'):
        // 		console.log('requires recent login')
        // }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addInfoToForm = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (formData && (!emailRef.current.value || !passwordRef.current.value || !passwordConfirmRef.current.value)) {
      // Change form data only
      postFormData(formData);
    } else if (!formData && (emailRef.current.value || passwordRef.current.value || passwordConfirmRef.current.value)) {
      // Change email/pass only
      emailPassChange();
    } else {
      // Change both
      postFormData(formData);
      emailPassChange();
    }
  };

  let progress = 0;

  const uploadCompanyLogo = async (e) => {
    if (e.target.files[0]) {
      const format = e.target.files[0].name.split(".").at(-1);
      const currentLogoRef = ref(storage, `logos/${currentUser.uid}.${format}`);
      const uploadTask = uploadBytesResumable(currentLogoRef, e.target.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setError(`${progress}% uploaded...`);
          progress !== 100 ? setError(`Logo ${progress.toFixed(0)}% uploaded..`) : setError("");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await setDoc(doc(db, "users", currentUser.email), { logo: downloadURL }, { merge: true });
          });
        }
      );
    }
  };

  // useEffect(() => getCurrentUserInfo(), [progress]);
  useEffect(() => getCurrentUserInfo(), [progress, userInfo.logo]);

  return (
    <section className="main-section">
      <article className="main-section__container profile-update">
        <div className="title-container profile-title">
          <h1 className="page-title">Profile</h1>
        </div>
        <div className="profile-page-container">
          <fieldset className="business-info-fieldset">
            <div className="name-and-logo">
              <input
                type="text"
                defaultValue={userInfo["company-name"]}
                name="company-name"
                onChange={(e) => addInfoToForm(e)}
                className="company-name"
              />
              <div
                ref={photoInputForm}
                onClick={() => updateCompanyLogo.current.click()}
                className={`company-logo-container ${logoState}`}
                id="photo-input-form"
              >
                <input type="file" ref={updateCompanyLogo} id="photo-input" onChange={(e) => uploadCompanyLogo(e)} />
                {logo}
              </div>
            </div>
            <div className="error update-profile-error">{error}</div>
            <div className="update-street">
              <h2 className="item-attribute">Street</h2>
              <input
                ref={updateStreetRef}
                defaultValue={userInfo["street"]}
                name="street"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="address"
              />
            </div>
            <div className="update-city">
              <h2 className="item-attribute">City</h2>
              <input
                ref={updateCityRef}
                defaultValue={userInfo["city"]}
                name="city"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="text"
              />
            </div>
            <div className="update-postcode">
              <h2 className="item-attribute">Postcode</h2>
              <input
                ref={updatePostcodeRef}
                defaultValue={userInfo["postcode"]}
                name="postcode"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="text"
              />
            </div>
            <div className="update-country">
              <h2 className="item-attribute">Country</h2>
              <input
                ref={updateCountryRef}
                defaultValue={userInfo["country"]}
                name="country"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="text"
              />
            </div>
            <div className="update-business-number">
              <h2 className="item-attribute">Business Number</h2>
              <input
                ref={updateBusinessNumberRef}
                defaultValue={userInfo["business-number"]}
                name="business-number"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="text"
              />
            </div>
            <div className="update-vat-registration">
              <h2 className="item-attribute">VAT registration</h2>
              <input
                ref={updateVATregRef}
                defaultValue={userInfo["vat-registration"]}
                name="vat-registration"
                onChange={(e) => addInfoToForm(e)}
                className="update-info-input"
                type="text"
              />
            </div>
            <br className="profile-title" />
            <div className="update-email">
              <h2 className="item-attribute">Email</h2>
              <input
                type="email"
                id="email"
                className="update-info-input"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />{" "}
            </div>
            <div className="update-password">
              <h2 className="item-attribute">New Password</h2>
              <input
                type="password"
                id="password"
                className="update-info-input"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
                defaultValue={null}
              />
            </div>
            <div className="update-password-confirm">
              <h2 className="item-attribute">Confirm New Password</h2>
              <input
                type="password"
                id="password-confirm"
                className="update-info-input"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </div>
            <div onClick={handleSubmit} className="add-items update-info" disabled={loading}>
              Update
            </div>
            <div onClick={() => setActiveComponent("invoices")} className="add-items cancel-button">
              Cancel
            </div>
            <div type="link" className="add-items logout-button" onClick={handleLogout}>
              Log Out
            </div>
          </fieldset>
        </div>
      </article>
    </section>
  );
}
