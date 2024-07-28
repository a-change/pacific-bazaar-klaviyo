import { Container, ContainerProps } from "@mui/material";

const JustifiedFlexContainer: React.FC<ContainerProps> = ({ children, ...props }) => (
  <Container
    {...props}
    sx={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
    {children}
  </Container>
);

export default JustifiedFlexContainer;
