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

import { formLogin, formLoginIsValid } from "./formdata/formLogin";

const EMAIL = process.env.REACT_APP_EMAIL;
const PASSWORD = process.env.REACT_APP_PASSWORD;
const IP = process.env.REACT_APP_IP;
const PH_UP = process.env.REACT_APP_PH_UP;
const PH_DOWN = process.env.REACT_APP_PH_DOWN;
const NUTRISI = process.env.REACT_APP_NUTRISI;

const App = () => {
  const [login, setLogin] = useState(formLogin);
  const [isLogin, setIsLogin] = useState(false);
  const [statistic, setStatistic] = useState([ { suhu: "0", nutrisi: "0", ph: "0" } ]);
  const [series, setSeries] = useState([ { data: [] } ])

  const { email, password } = login;

  // Fungsi untuk mengubah value untuk login
  const inputChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    // Ngecek jika value kosong
    if(isEmpty(value || "", { ignore_whitespace: true })){
      const data = {
        ...login,
        [name]: {
          ...login[name],
          value: value,
          isValid: false,
          message: "Kolom tidak boleh kosong",
        },
      };
      setLogin(data);
    } else {
      // set data ke state
      const data = {
        ...login,
        [name]: {
          ...login[name],
          value: value,
          isValid: true,
          message: null,
        },
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
        const dataWS = new W3CWebSocket(`ws://${IP}`, ['arduino']);

        // fungsi untuk menerima data dari websocket
        dataWS.onmessage = message => {
          if(message.data !== "Connected"){
            if(typeof message.data == "string") {
              let dataObj = {}
              const dataMsg = message.data.split(",")
              for(let val of dataMsg) {
                dataObj[val.split(":")[0]] = val.split(":")[1]
              }
              setStatistic(data => [...data, dataObj])

              const x = Math.floor(new Date().getTime() / 1000); // data time
              const y = dataObj['ph'] // data pH untuk grafik

              let { data } = series[0]; 
              data.push({x,y})
              setSeries([{ data }])
              ApexCharts.exec("realtime", "updateSeries", series) // fungsi untuk update chart realtime
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
  const suhu = statistic.map(data => data.suhu) // membuat array untuk data suhu
  const nutrisi = statistic.map(data => data.nutrisi) // membuat array unutk data nutrisi

  // option konfigurasi untuk grafik
  const optionPH = {
    chart: {
      id: 'realtime',
      type: 'area',
      zoom: { enabled: false },
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
    },
    yaxis: { min: 0 },
    sparkline: { enabled: true },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      range: 10,
      labels: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    plotOptions: {
      bar: { columnWidth: '45%', }
    },
    stroke: { 
      curve: 'smooth', 
      width: 3,
    },
    title: {
      text: parseFloat(ph[ph.length - 1]) + ' pH',
      offsetX: 30,
      style: {
        fontSize: '24px',
        cssClass: 'display-4'
      }
    },
    subtitle: {
      text: 'Power of Hydrogen',
      offsetX: 30,
      style: {
        fontSize: '14px',
        cssClass: 'apexcharts-yaxis-title'
      }
    },
    colors: ['#54a0ff'],
  }

  const phValue = parseFloat(ph[ph.length - 1]) // data pH terbaru
  const isOnPHUp = phValue < PH_UP // ketentuan untuk pompa pH UP menyala
  const isOnPHDown = phValue > PH_DOWN // ketentuan untuk pompa pH Down menyala
  const isOnNutrisi = nutrisi[nutrisi.length - 1] < NUTRISI // ketentuan untuk pompa nutrisi menyala

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

  },[isOnPHUp, isLogin])

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
  },[isOnPHDown, isLogin])

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
  },[isOnNutrisi, isLogin])

  return(
    <>
      {isLogin ? (
        <>
        <Navbar expand="lg" variant="light" bg="light">
          <Container>
            <Navbar.Brand className="font-weight-bold">HYDRO X TECH</Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link onClick={() => setIsLogin(false)}>Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Layout className="bg-white mt-5">
          <Layout.Content>
            <Container>
              <Row gutter={[16, 16]}>

                <Col lg={16} md={24} sm={24} xs={24}>
                  <Card className="mb-2 h-100 shadow">
                    <Chart options={optionPH} series={series} height={428} />
                  </Card>
                </Col>

                <Col lg={8} md={24} sm={24} xs={24}>
                  <Card className="mb-3 shadow">
                    <Card.Body className="p-2 h-100">
                      <h5>Suhu</h5>
                      <h2 className="text-center display-4">{suhu[suhu.length - 1]}°C</h2>
                    </Card.Body>
                  </Card>

                  <Card className="mb-3 shadow">
                    <Card.Body className="p-2">
                      <h5>Nutrisi</h5>
                      <h2 className="text-center display-4">{nutrisi[nutrisi.length - 1]} ppm</h2>
                    </Card.Body>
                  </Card>

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
    </>
  )
};

export default App;
