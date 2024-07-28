import { NextPage } from "next";
import SEO from "./SEO";
import { FlexRowCenter } from "./components/flex-box";
import Signup from "./pages-sections/sessions/Signup";

const SignUpPage: NextPage = () => {
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Sign up" />
      <Signup />
    </FlexRowCenter>
  );
};

export default SignUpPage;
