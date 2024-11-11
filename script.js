let device;
let characteristic;

document.getElementById('scan').addEventListener('click', async () => {
    try {
        const devices = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['your-service-uuid']
        });
        const deviceList = document.getElementById('deviceList');
        deviceList.innerHTML = '';
        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.id;
            option.textContent = device.name || `Unknown Device (${device.id})`;
            deviceList.appendChild(option);
        });
    } catch (error) {
        console.error('Scanning failed', error);
    }
});

document.getElementById('connect').addEventListener('click', async () => {
    try {
        const deviceId = document.getElementById('deviceList').value;
        device = await navigator.bluetooth.requestDevice({
            filters: [{ id: deviceId }],
            optionalServices: ['your-service-uuid']
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('your-service-uuid');
        characteristic = await service.getCharacteristic('your-characteristic-uuid');
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('status').style.color = 'green';
        // Enable the controls
        document.getElementById('availability').disabled = false;
        document.getElementById('reset').disabled = false;
        document.getElementById('powerSwitch').disabled = false;
        document.getElementById('multicolorSwitch').disabled = false;
        document.getElementById('brightnessSlider').disabled = false;
        document.getElementById('speedSlider').disabled = false;
        document.getElementById('colorPicker').disabled = false;
    } catch (error) {
        console.error('Connection failed', error);
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('status').style.color = 'red';
    }
});

document.getElementById('sendCommand').addEventListener('click', async () => {
    const command = document.getElementById('terminal').value;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('availability').addEventListener('click', async () => {
    const button = document.getElementById('availability');
    const command = button.classList.contains('green') ? 'Unavailable' : 'Available';
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
    button.textContent = command;
    button.classList.toggle('green');
    button.classList.toggle('red');
});

document.getElementById('reset').addEventListener('click', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('reset');
    await characteristic.writeValue(data);
});

document.getElementById('powerSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'on' : 'off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('powerLabel').textContent = `Power: ${command}`;
});

document.getElementById('multicolorSwitch').addEventListener('change', async (event) => {
    let command = event.target.checked ? 'multicolor:on' : 'multicolor:off';
    let encoder = new TextEncoder();
    let data = encoder.encode(command);
    await characteristic.writeValue(data);
    document.getElementById('multicolorLabel').textContent = `Multicolor: ${command}`;
});

document.getElementById('brightnessSlider').addEventListener('input', async (event) => {
    const value = event.target.value;
    document.getElementById('brightnessValue').textContent = value;
    const command = `brightness:${value}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('speedSlider').addEventListener('input', async (event) => {
    const value = event.target.value;
    document.getElementById('speedValue').textContent = value;
    const command = `speed:${value}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});

document.getElementById('colorPicker').addEventListener('input', async (event) => {
    const color = event.target.value;
    const r = parseInt(color.slice(1, 3), 16).toString().padStart(3, '0');
    const g = parseInt(color.slice(3, 5), 16).toString().padStart(3, '0');
    const b = parseInt(color.slice(5, 7), 16).toString().padStart(3, '0');
    const command = `color:${r},${g},${b}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(command);
    await characteristic.writeValue(data);
});