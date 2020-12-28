import { Form, Input, Button, Image } from "antd";

import RowB from "react-bootstrap/Row";
import ColB from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const FormError = ({ children }) => <small className="form-text text-left text-danger mb-0">{children}</small>

const LoginComponent = ({ state, onChange, submit }) => {
  const { email, password } = state;

  return(
    <>
      <Container className="vh-100">
        <section className="text-center h-100">
          <RowB className="align-items-center justify-content-center h-100">
            <ColB lg={5} md={8} sm={10}>
              <div className="mb-3">
                <Image 
                  width={150}
                  src="/logo.jpg"
                  alt="hydrotech-logo"
                />
              </div>
              <Card className="shadow-sm mt-3">
                <Card.Header className="text-left font-weight-normal h5">
                  Login
                </Card.Header>
                <Card.Body>
                  <Form layout="vertical" name="Login">
                    <Form.Item
                      label="Email"
                      className="mb-3"
                    >
                      <Input 
                        name="email"
                        placeholder="Email"
                        value={email.value}
                        onChange={onChange}
                      />
                      {!email.isValid && <FormError>{email.message}</FormError>}
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      className="mb-3"
                    >
                      <Input.Password 
                        name="password"
                        placeholder="Password"
                        value={password.value}
                        onChange={onChange}
                      />
                      {!password.isValid && <FormError>{password.message}</FormError>}
                    </Form.Item>

                    <Form.Item className="mb-0 float-right">
                      <Button type="primary" onClick={submit}>
                        LOGIN
                      </Button>
                    </Form.Item>
                  </Form>

                </Card.Body>
              </Card>
            </ColB>
          </RowB>
        </section>
      </Container>
    </>
  )
}

export default LoginComponent
