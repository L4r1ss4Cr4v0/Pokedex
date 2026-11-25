package com.pokedex.config;

import com.pokedex.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserService userService;
    private final String username;
    private final String password;

    public AdminUserInitializer(UserService userService,
                                @Value("${app.security.username:admin}") String username,
                                @Value("${app.security.password:}") String password) {
        this.userService = userService;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (password == null || password.isBlank()) {
            log.info("ADMIN_PASSWORD não definida: nenhum administrador será criado.");
            return;
        }
        if (userService.exists(username)) {
            return;
        }
        userService.create(username, "Administrador", password, UserService.ROLE_ADMIN);
        log.info("Usuário administrador '{}' criado.", UserService.normalize(username));
    }
}
