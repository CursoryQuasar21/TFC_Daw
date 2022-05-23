import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, atri: any[], ...args: any): any {
    const resultados: unknown[] = [];
    // console.log(value);
    // console.log(atri);
    // console.log(args);
    const longitudArray = this.longitudRealArray(args);
    if (longitudArray === 0) {
      for (const element of value) {
        resultados.push(element);
      }
      return resultados;
    }
    for (const element of value) {
      let contArgs = 0;
      for (const campo of atri) {
        switch (campo) {
          case 'id': {
            if (args[0][0] !== undefined && args[0][0] !== null && element.id.toString().indexOf(args[0][0].toString()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'nombre': {
            if (args[0][1] !== undefined && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'apellidos': {
            if (args[0][2] !== undefined && element.nombre.toLowerCase().indexOf(args[0][2].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'pasaporte': {
            if (args[0][3] !== undefined && element.nombre.toLowerCase().indexOf(args[0][3].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadEquipaje': {
            if (args[0][4] !== undefined && args[0][4] !== null && element.nombre.toLowerCase().indexOf(args[0][4].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'numeroAsiento': {
            if (args[0][5] !== undefined && args[0][5] !== null && element.nombre.toLowerCase().indexOf(args[0][5].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'tipo': {
            if (args[0][1] !== undefined && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'costeFabricacion': {
            if (args[0][1] !== undefined && args[0][1] !== null && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'anioFabricacion': {
            if (args[0][2] !== undefined && element.nombre.toLowerCase().indexOf(args[0][2].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'motores': {
            if (args[0][2] !== undefined && args[0][2] !== null && element.nombre.toLowerCase().indexOf(args[0][2].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadPilotos': {
            if (args[0][3] !== undefined && args[0][3] !== null && element.nombre.toLowerCase().indexOf(args[0][3].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadTripulantes': {
            if (args[0][4] !== undefined && args[0][4] !== null && element.nombre.toLowerCase().indexOf(args[0][4].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadPasajeros': {
            if (args[0][5] !== undefined && args[0][5] !== null && element.nombre.toLowerCase().indexOf(args[0][5].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'cantidadEquipajes': {
            if (args[0][6] !== undefined && args[0][6] !== null && element.nombre.toLowerCase().indexOf(args[0][6].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'fechaOD': {
            if (args[0][1] !== undefined && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'precio': {
            if (args[0][1] !== undefined && args[0][1] !== null && element.nombre.toLowerCase().indexOf(args[0][1].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
          case 'ciudad': {
            if (
              args[0][2] !== undefined &&
              args[0][2] !== null &&
              element.ciudad !== null &&
              element.ciudad.id.toString().indexOf(args[0][2].toString()) > -1
            ) {
              contArgs++;
            }
            break;
          }
          case 'pais': {
            if (args[0][2] !== undefined && args[0][2] !== null && element.nombre.toLowerCase().indexOf(args[0][2].toLowerCase()) > -1) {
              contArgs++;
            }
            break;
          }
        }
      }
      if (longitudArray === contArgs) {
        resultados.push(element);
      }
    }
    return resultados;
  }

  longitudRealArray(array: any): number {
    let cont = 0;
    for (const element of array[0]) {
      if (element !== null && element !== undefined && element.toString() !== '') {
        cont++;
      }
    }
    return cont;
  }
}
