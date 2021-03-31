import { useEffect, useState } from "react";
import { Layout, notification, Row, Col, Switch } from "antd";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import isEqual from "validator/lib/equals";
import isEmpty from "validator/lib/isEmpty";

import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import LoginComponent from "./components/Login"
import DrawerComponent from "./components/Drawer"
import SuhuGraph from "./components/Graph/Suhu"
import AirGraph from "./components/Graph/Air"

import { formLogin, formLoginIsValid } from "./formdata/formLogin";
import { formEditValue } from './formdata/formEditValue'
import { defaultOptionPH } from "./data/graphic"

const EMAIL = process.env.REACT_APP_EMAIL;
const PASSWORD = process.env.REACT_APP_PASSWORD;
const PH_UP = process.env.REACT_APP_PH_UP;
const PH_DOWN = process.env.REACT_APP_PH_DOWN;
const NUTRISI = process.env.REACT_APP_NUTRISI;

const App = () => {
  const [login, setLogin] = useState(formLogin);
  const [setting, setSetting] = useState(formEditValue);
  const [isLogin, setIsLogin] = useState(false);
  const [statistic, setStatistic] = useState([ { sh: "0", tds: "0", ldr: "0", td: "0", ph: "0" } ]);
  const [series, setSeries] = useState([ { data: [] } ])
  const [showDrawer, setShowDrawer] = useState(false)
  const [client, setClient] = useState();

  const { email, password, ipwebsocket } = login;
  const { ph_up, ph_down, tds } = setting

  // Fungsi untuk mengubah value untuk login
  const inputChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    // Ngecek jika value kosong
    if(isEmpty(value || "", { ignore_whitespace: true })){
      const data = {
        ...login,
        [name]: { ...login[name], value: value, isValid: false, message: "Kolom tidak boleh kosong", },
      };
      setLogin(data);
    } else {
      // set data ke state
      const data = {
        ...login,
        [name]: { ...login[name], value: value, isValid: true, message: null, },
      };
      setLogin(data);
    }
  }

  // fungsi tombol untuk login dan koneksi ke web socket
  const submitLoginHandler = () => {
    // ngecek jika value untuk login sudah tervalidasi
    if(formLoginIsValid(login, setLogin)){
      // jika value sudah sesuai
      if(isEqual(email.value, EMAIL) && isEqual(password.value, PASSWORD)){
        notification.success({
          message: "Success",
          description: "Selamat datang Hydropronic",
        });
        setIsLogin(true);

        // fungsi untuk koneksi menggunakan websocket
        const dataWS = new W3CWebSocket(`ws://${ipwebsocket.value}:81`, ['arduino']);
        setClient(dataWS); //set websocket ke state untuk digunakan saat mengubah value

        // fungsi untuk menerima data dari websocket
        dataWS.onmessage = message => {
          if(message.data !== "Connected"){
            if(typeof message.data == "string") {

              if(message.data.startsWith("setting|")){
                let dataSettingObj = {}
                const dataSetting = message.data.split("|")
                dataSetting.shift()

                for(let val of dataSetting) {
                  dataSettingObj[val.split(":")[0]] = val.split(":")[1]
                }

                const settingWs = {...setting}
                for (const [key, value] of Object.entries(dataSettingObj)) {
                  if(key === "pu") settingWs["ph_up"] = {value: parseFloat(value), isValid: true, message: null}
                  if(key === "pd") settingWs["ph_down"] = {value: parseFloat(value), isValid: true, message: null}
                  if(key === "kp") settingWs["kalibrasi_ph"] = {value: parseInt(value), isValid: true, message: null}
                  if(key === "kt") settingWs["kalibrasi_tds"] = {value: parseInt(value), isValid: true, message: null}
                  if(key === "st") settingWs["tds"] = {value: parseInt(value), isValid: true, message: null}
                }
                setSetting(settingWs)
              } else {
                let dataObj = {}
                const dataMsg = message.data.split(",")

                for(let val of dataMsg) {
                  dataObj[val.split(":")[0]] = val.split(":")[1]
                }
                setStatistic(data => [...data, dataObj]) // fungsi untuk update data ke state dari arduino
                
                const x = Math.floor(new Date().getTime() / 1000); // data time
                const y = dataObj['ph'] // data pH untuk grafik

                let { data } = series[0]; 
                data.push({x,y})
                setSeries([{ data }])
                ApexCharts.exec("realtime", "updateSeries", series) // fungsi untuk update chart realtime
              }

            }
          }
        }
      } else { // jika akun tidak valid
        setIsLogin(false);
        notification.error({
          message: "Error",
          description: "Akun tidak terdaftar",
        });
      }
    }
  }

  let ph = statistic.map(data => parseFloat(data.ph)) // membuat array untuk data pH
  const suhu = statistic.map(data => parseInt(data.sh)) // membuat array untuk data suhu
  const nutrisi = statistic.map(data => parseInt(data.tds)) // membuat array unutk data nutrisi
  const cahaya = statistic.map(data => parseInt(data.ldr)) // membuat array unutk data intensitas cahaya
  const ta = statistic.map(data => parseInt(data.ta)) // membuat array unutk data tinggi air

  // option konfigurasi untuk grafik
  const optionPH = {
    ...defaultOptionPH,
    title: {
      text: parseFloat(ph[ph.length - 1]) ? parseFloat(ph[ph.length - 1]) : 0 + ' pH', // data pH
      offsetX: 30,
      style: {
        fontSize: '24px',
        cssClass: 'display-4'
      }
    },
  }

  // fungsi untuk menampilkan drawer untuk ngeset value
  const showDrawerHandler = () => {
    setShowDrawer(true)
  }
  // fungsi untuk menutup drawer untuk ngeset value
  const closeDrawerHandler = () => {
    setShowDrawer(false)
  }

  const phValue = parseFloat(ph[ph.length - 1]) // data pH terbaru
  const isOnPHUp = phValue < parseFloat(ph_up.value) // ketentuan untuk pompa pH UP menyala
  const isOnPHDown = phValue > parseFloat(ph_down.value) // ketentuan untuk pompa pH Down menyala
  const isOnNutrisi = parseInt(nutrisi[nutrisi.length - 1]) < parseInt(tds.value) // ketentuan untuk pompa nutrisi menyala

  useEffect(() => {
    if(isLogin){
      const data = {
        ...setting,
        ph_up: { value: PH_UP, isValid: true, message: null },
        ph_down: { value: PH_DOWN, isValid: true, message: null },
        tds: { value: NUTRISI, isValid: true, message: null },
      }
      setSetting(data)
    }
  }, [isLogin])

  // fungsi untuk mengirimkan notifikasi
  useEffect(() => {
    if(isLogin){
      if(isOnPHUp){
        notification.success({
          message: "Pompa pH up",
          description: "Pompa pH up dihidupkan",
        });
      } else {
        notification.success({
          message: "Pompa pH up",
          description: "Pompa pH up dimatikan",
        });
      }
    }

  },[isOnPHUp])

  // fungsi untuk mengirimkan notifikasi
  useEffect(() => {
    if(isLogin){
      if(isOnPHDown){
        notification.success({
          message: "Pompa pH down",
          description: "Pompa pH down dihidupkan",
        });
      } else {
        notification.success({
          message: "Pompa pH down",
          description: "Pompa pH down dimatikan",
        });
      }
    }
  },[isOnPHDown])

  // fungsi untuk mengirimkan notifikasi
  useEffect(() => {
    if(isLogin){
      if(isOnNutrisi){
        notification.success({
          message: "Pompa nutrisi",
          description: "Pompa nutrisi dihidupkan",
        });
      } else {
        notification.success({
          message: "Pompa nutrisi",
          description: "Pompa nutrisi dimatikan",
        });
      }
    }
  },[isOnNutrisi])

  return(
    <>
      {isLogin ? (
        <>
        <Navbar expand="lg" variant="light" bg="light">
          <Container>
            <Navbar.Brand className="font-weight-bold">HYDRO X TECH</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link onClick={showDrawerHandler}>Set Value</Nav.Link>
              <Nav.Link onClick={() => setIsLogin(false)}>Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Layout className="bg-transparent mt-5">
          <Layout.Content>
            <Container>
              <Row gutter={[16, 16]}>

                <Col lg={16} md={24} sm={24} xs={24}>
                  <Card className="mb-2 shadow">
                    <Chart options={optionPH} series={series} height={428} />
                  </Card>
                </Col>

                <Col lg={8} md={24} sm={24} xs={24}>
                  <Card className="mb-3 shadow">
                    <Card.Body className="p-2">
                      <h5 className="mb-n2">Suhu</h5>
                      <SuhuGraph data={parseInt(suhu[suhu.length - 1]) ? parseInt(suhu[suhu.length - 1]) : 0} />
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 shadow">
                    <Card.Body className="p-2">
                      <h5>Tinggi Air</h5>
                      <AirGraph data={parseInt(ta[ta.length - 1]) ? parseInt(ta[ta.length - 1]) : 0} />
                    </Card.Body>
                  </Card>
                </Col>

              </Row>

              <Row gutter={16} className="mb-5">
                <Col span={8}>
                  <Card className="mb-3 shadow h-100 p-2">
                    <h5>Nutrisi</h5>
                    <Card.Body className="p-2 align-items-center d-flex justify-content-center">
                      <h2 className="text-center display-4 mb-0">
                        {parseInt(nutrisi[nutrisi.length - 1]) ? parseInt(nutrisi[nutrisi.length - 1]) : 0} ppm
                      </h2>
                    </Card.Body>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card className="mb-3 shadow h-100 p-2">
                    <h5>Intensitas Cahaya</h5>
                    <Card.Body className="p-2 align-items-center d-flex justify-content-center">
                      <h2 className="text-center display-4 mb-0">
                        {parseInt(cahaya[cahaya.length - 1]) ? parseInt(cahaya[cahaya.length - 1]) : 0} lux
                      </h2>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col span={8}>
                  <Card className="shadow">
                    <Card.Body className="p-2 text-center">
                      <h5 className="text-left">Pompa</h5>
                      <p>pH Up: <Switch checkedChildren="On" unCheckedChildren="Off"  checked={isOnPHUp} /></p> 
                      <p>pH Down: <Switch checkedChildren="On" unCheckedChildren="Off"  checked={isOnPHDown} /></p> 
                      <p>Nutrisi: <Switch checkedChildren="On" unCheckedChildren="Off"  checked={isOnNutrisi} /></p> 
                    </Card.Body>
                  </Card>
                </Col>

              </Row>
            </Container>
          </Layout.Content>
        </Layout>
        </>
      ) : (
        <LoginComponent // Komponent untuk login
          state={login} 
          onChange={inputChangeHandler} 
          submit={submitLoginHandler} 
        />
      )}

      <DrawerComponent // komponent untuk merubah setting
        visible={showDrawer}
        onClose={closeDrawerHandler}
        client={client}
        setting={setting}
        setSetting={setSetting}
      />

    </>
  )
};

export default App;
