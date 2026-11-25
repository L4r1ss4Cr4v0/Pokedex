package com.pokedex.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "pokemons")
public class Pokemon {
    @Id
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 50, message = "O nome deve ter no máximo 50 caracteres")
    private String name;

    @NotNull(message = "Os atributos são obrigatórios")
    @Valid
    private Stats stats;

    @NotEmpty(message = "Informe ao menos um tipo")
    @Size(max = 2, message = "Um Pokémon pode ter no máximo 2 tipos")
    @Valid
    private List<TypeRef> types;

    private Long imageVersion;
    private Long retroImageVersion;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Stats getStats() {
        return stats;
    }

    public void setStats(Stats stats) {
        this.stats = stats;
    }

    public List<TypeRef> getTypes() {
        return types;
    }

    public void setTypes(List<TypeRef> types) {
        this.types = types;
    }

    public Long getImageVersion() {
        return imageVersion;
    }

    public void setImageVersion(Long imageVersion) {
        this.imageVersion = imageVersion;
    }

    public Long getRetroImageVersion() {
        return retroImageVersion;
    }

    public void setRetroImageVersion(Long retroImageVersion) {
        this.retroImageVersion = retroImageVersion;
    }
}
