package com.ihm.project.jwt;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ihm.project.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailServImp implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String normalizedIdentifier = identifier == null ? "" : identifier.trim().toLowerCase();
        return userRepository.findByEmailOrUsername(normalizedIdentifier, normalizedIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con identificador: " + identifier));
    }
}
