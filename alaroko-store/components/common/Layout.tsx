import { ReactNode } from "react"
import Header from "../menu/Header";

const Layout = ({children}:{children: ReactNode}) => {
  return (<>
    <Header />
    <main>
      {children}
    </main>
  </>);
}

export default Layout;