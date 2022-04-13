package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Vuelo;
import com.mycompany.myapp.repository.VueloRepository;
import com.mycompany.myapp.service.VueloService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Vuelo}.
 */
@RestController
@RequestMapping("/api")
public class VueloResource {

    private final Logger log = LoggerFactory.getLogger(VueloResource.class);

    private static final String ENTITY_NAME = "vuelo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VueloService vueloService;

    private final VueloRepository vueloRepository;

    public VueloResource(VueloService vueloService, VueloRepository vueloRepository) {
        this.vueloService = vueloService;
        this.vueloRepository = vueloRepository;
    }

    /**
     * {@code POST  /vuelos} : Create a new vuelo.
     *
     * @param vuelo the vuelo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vuelo, or with status {@code 400 (Bad Request)} if the vuelo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vuelos")
    public ResponseEntity<Vuelo> createVuelo(@Valid @RequestBody Vuelo vuelo) throws URISyntaxException {
        log.debug("REST request to save Vuelo : {}", vuelo);
        if (vuelo.getId() != null) {
            throw new BadRequestAlertException("A new vuelo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vuelo result = vueloService.save(vuelo);
        return ResponseEntity
            .created(new URI("/api/vuelos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vuelos/:id} : Updates an existing vuelo.
     *
     * @param id the id of the vuelo to save.
     * @param vuelo the vuelo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vuelo,
     * or with status {@code 400 (Bad Request)} if the vuelo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vuelo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vuelos/{id}")
    public ResponseEntity<Vuelo> updateVuelo(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Vuelo vuelo)
        throws URISyntaxException {
        log.debug("REST request to update Vuelo : {}, {}", id, vuelo);
        if (vuelo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vuelo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vueloRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vuelo result = vueloService.save(vuelo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vuelo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vuelos/:id} : Partial updates given fields of an existing vuelo, field will ignore if it is null
     *
     * @param id the id of the vuelo to save.
     * @param vuelo the vuelo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vuelo,
     * or with status {@code 400 (Bad Request)} if the vuelo is not valid,
     * or with status {@code 404 (Not Found)} if the vuelo is not found,
     * or with status {@code 500 (Internal Server Error)} if the vuelo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vuelos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Vuelo> partialUpdateVuelo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Vuelo vuelo
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vuelo partially : {}, {}", id, vuelo);
        if (vuelo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vuelo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vueloRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vuelo> result = vueloService.partialUpdate(vuelo);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vuelo.getId().toString())
        );
    }

    /**
     * {@code GET  /vuelos} : get all the vuelos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vuelos in body.
     */
    @GetMapping("/vuelos")
    public ResponseEntity<List<Vuelo>> getAllVuelos(Pageable pageable) {
        log.debug("REST request to get a page of Vuelos");
        Page<Vuelo> page = vueloService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vuelos/:id} : get the "id" vuelo.
     *
     * @param id the id of the vuelo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vuelo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vuelos/{id}")
    public ResponseEntity<Vuelo> getVuelo(@PathVariable Long id) {
        log.debug("REST request to get Vuelo : {}", id);
        Optional<Vuelo> vuelo = vueloService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vuelo);
    }

    /**
     * {@code DELETE  /vuelos/:id} : delete the "id" vuelo.
     *
     * @param id the id of the vuelo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vuelos/{id}")
    public ResponseEntity<Void> deleteVuelo(@PathVariable Long id) {
        log.debug("REST request to delete Vuelo : {}", id);
        vueloService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
