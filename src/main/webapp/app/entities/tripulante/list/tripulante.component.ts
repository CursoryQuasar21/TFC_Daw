import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITripulante } from '../tripulante.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { TripulanteService } from '../service/tripulante.service';
import { TripulanteDeleteDialogComponent } from '../delete/tripulante-delete-dialog.component';

@Component({
  selector: 'jhi-tripulante',
  templateUrl: './tripulante.component.html',
})
export class TripulanteComponent implements OnInit {
  tripulantes?: ITripulante[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  // ==================================================================================================================================
  // SECCION VARIABLES PARA FILTRAR

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable para manejar los atributos de los objetos tripulante
  atributos = ['id', 'nombre', 'apellidos', 'pasaporte', 'avion'];
  // -------------------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------------------------
  // Variable para manejar los filtros de la lista de tripulantes
  filtro: any = [];
  // -------------------------------------------------------------------------------------------------------------------------------

  // FIN SECCION
  // ==================================================================================================================================

  constructor(
    protected tripulanteService: TripulanteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.tripulanteService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ITripulante[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: ITripulante): number {
    return item.id!;
  }

  delete(tripulante: ITripulante): void {
    const modalRef = this.modalService.open(TripulanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tripulante = tripulante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ITripulante[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/tripulante'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.tripulantes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
