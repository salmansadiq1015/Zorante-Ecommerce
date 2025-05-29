import Image from "next/image";
import Login from "./components/Auth/Login";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Login />
    </div>
  );
}
