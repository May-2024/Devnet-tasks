const { createObjectCsvWriter } = require('csv-writer');

const getCamarasCsv = async () => {
    try {
      const cctv_list_servers = [
        "10.225.0.253",
        // Agrega más IPs aquí si es necesario
      ];

      const username = "roiss";
      const password = "MNuqYXiugdfsY1NvKYdr";
      const dataCamaras = [{
        cctvServer: '192.168.1.2',
        integrator: 'Integrator2',
        name: 'Camera2',
        server: 'Server2',
        enabled: false,
        valid: true,
        url: 'http://camera2-url'
      }];

      // Generar el archivo CSV
      if (dataCamaras.length > 0) {
        const csvWriter = createObjectCsvWriter({
          path: 'camaras.csv', // Ruta y nombre del archivo CSV
          header: [
            { id: 'cctvServer', title: 'CCTV Server' },
            { id: 'integrator', title: 'Integrator' },
            { id: 'name', title: 'Name' },
            { id: 'server', title: 'Server' },
            { id: 'enabled', title: 'Enabled' },
            { id: 'valid', title: 'Valid' },
            { id: 'url', title: 'URL' },
          ],
        });

        await csvWriter.writeRecords(dataCamaras);
        console.log('Archivo CSV creado con éxito: camaras.csv');
      } else {
        console.log('No se encontraron cámaras para generar el archivo CSV.');
      }
    } catch (error) {
      console.error('Error al obtener las cámaras:', error);
      throw new Error("Error al obtener la información del Dispositivo");
    }
  }

  getCamarasCsv()