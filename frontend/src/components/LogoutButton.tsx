import {useRouter} from "next/navigation";

function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    console.log("Przed usunięciem tokenu:", localStorage.getItem("access_token")); // Debug
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
    console.log("Po usunięciu tokenu:", localStorage.getItem("access_token")); // Debug
    router.push("/login");
  };

  return <button onClick={handleLogout}>Wyloguj</button>;
}

export default LogoutButton;
