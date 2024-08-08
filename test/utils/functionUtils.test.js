import { expect } from 'chai';
import { createHash, isValidPassword } from '../../src/utils/functionUtils.js';

const testPassword = '1234567890';
const validBcryptFormat = /^\$2[aby]\$10\$.{53}$/;

    describe('Test Utils bcryp', function () {

        // Se ejecuta ANTES de comenzar el paquete de tests
    
        before(function () {
        });
    
        // Se ejecuta ANTES de CADA test
    
        beforeEach(function () {});
    
        // Se ejecuta FINALIZADO el paquete de tests
    
        after(function () {});
    
        // Se ejecuta FINALIZADO CADA text
    
        afterEach(function () {});

    
        it('createHash() debe hashear correctamente la clave', async function () {
            const result = createHash(testPassword);
            
            expect(result).to.be.not.equal(testPassword);
            expect(result).to.match(validBcryptFormat);
        }); 

        it('isvalidPassword() debe retornar true si coincide el hash', async function () {
            const hashed = createHash(testPassword);
            const result = isValidPassword({password: hashed}, testPassword);

            expect(result).to.be.true;
            
        }); 
            
    });