jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PaisService } from '../service/pais.service';
import { IPais, Pais } from '../pais.model';

import { PaisUpdateComponent } from './pais-update.component';

describe('Component Tests', () => {
  describe('Pais Management Update Component', () => {
    let comp: PaisUpdateComponent;
    let fixture: ComponentFixture<PaisUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let paisService: PaisService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PaisUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PaisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaisUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      paisService = TestBed.inject(PaisService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const pais: IPais = { id: 456 };

        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pais));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pais = { id: 123 };
        spyOn(paisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pais }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(paisService.update).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pais = new Pais();
        spyOn(paisService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pais }));
        saveSubject.complete();

        // THEN
        expect(paisService.create).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pais = { id: 123 };
        spyOn(paisService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(paisService.update).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
