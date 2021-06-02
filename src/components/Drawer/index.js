import { Drawer, Form, Button, Col, Row, InputNumber } from 'antd';

const DrawerValueForm = ({ visible, onClose, client, setting, setSetting }) => {

  const onSettingChange = (e, item) => {
    const data = {
      ...setting,
      [item]: { ...setting[item], value: e, isValid: true, message: null }
    }
    setSetting(data)
  }

  const onSubmit = e => {
    e.preventDefault()
    const { ph_up, ph_down, kalibrasi_ph, kalibrasi_tds, tds} = setting

    let dataString = ""
    if(ph_up.value !== "" && ph_up.value !== null) {
      dataString += "pu:" + ph_up.value + "|"
    }
    if(ph_down.value !== "" && ph_down.value !== null) {
      dataString += "pd:" + ph_down.value + "|"
    }
    if(kalibrasi_ph.value !== "" && kalibrasi_ph.value !== null) {
      dataString += "kp:" + kalibrasi_ph.value + "|"
    }
    if(kalibrasi_tds.value !== "" && kalibrasi_tds.value !== null) {
      dataString += "kt:" + kalibrasi_tds.value + "|"
    }
    if(tds.value !== "" && tds.value !== null) {
      dataString += "st:" + tds.value + "|"
    }

    let checkString = dataString.slice(-1)
    // check jika ada "|" pada string terakhir dan hapus jika true
    if(checkString === "|") checkString = dataString.slice(0, -1)
    else checkString = dataString

    client.send("setting|" + checkString) // fungsi untuk mengirim data ke arduino
    client.send("setting|" + checkString) // fungsi untuk mengirim data ke arduino
  }

  const { ph_up, ph_down, kalibrasi_ph, kalibrasi_tds, tds } = setting

  return(
    <>
      <Drawer
        title="Setting Value"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={false}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ph_up" label="PH UP">
                <InputNumber 
                  min={0} 
                  max={10} 
                  step={0.1}
                  className="w-100"
                  placeholder="PH UP" 
                  value={ph_up.value}
                  onChange={e => onSettingChange(e, "ph_up")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ph_down" label="PH DOWN">
                <InputNumber 
                  min={0} 
                  max={10} 
                  step={0.1}
                  className="w-100"
                  placeholder="PH DOWN" 
                  value={ph_down.value}
                  onChange={e => onSettingChange(e, "ph_down")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="kalibrasi_ph" label="KALIBRASI SENSOR PH">
                <InputNumber 
                  min={0} 
                  max={1000} 
                  className="w-100"
                  placeholder="Kalibrasi sensor PH" 
                  value={kalibrasi_ph.value}
                  onChange={e => onSettingChange(e, "kalibrasi_ph")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="kalibrasi_tds" label="KALIBRASI SENSOR TDS">
                <InputNumber 
                  min={0} 
                  max={1000} 
                  className="w-100"
                  placeholder="Kalibrasi sensor TDS" 
                  value={kalibrasi_tds.value}
                  onChange={e => onSettingChange(e, "kalibrasi_tds")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="tds" label="SET TDS">
                <InputNumber 
                  min={0} 
                  max={1000} 
                  className="w-100"
                  placeholder="Set TDS" 
                  value={tds.value}
                  onChange={e => onSettingChange(e, "tds")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Button block type="primary" onClick={onSubmit}>Submit</Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default DrawerValueForm
