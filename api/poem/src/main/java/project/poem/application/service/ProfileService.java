package project.poem.application.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.application.dto.ProfileDto;
import project.poem.domain.model.Profile;
import project.poem.domain.repository.ProfileRepository;
import project.poem.domain.repository.UserRepository;

@Service
public class ProfileService {
    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;
    public ProfileService(ProfileRepository profileRepo, UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }
    @Transactional(readOnly = true)
    public List<ProfileDto> listAll() {
        return profileRepo.findAll().stream().map(this::toDto).toList();
    }
    @Transactional(readOnly = true)
    public ProfileDto getByEmail(String email) {
        Profile p = profileRepo.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for email " + email));
        return toDto(p);
    }
    @Transactional
    public ProfileDto createOrUpdate(ProfileDto dto) {
        var userOpt = userRepo.findByEmail(dto.getUserEmail());
        if (userOpt.isEmpty()) throw new IllegalArgumentException("User not found: " + dto.getUserEmail());
        Profile profile = profileRepo.findByUserEmail(dto.getUserEmail()).orElse(new Profile());
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setPhone(dto.getPhone());
        profile.setUser(userOpt.get());
        return toDto(profileRepo.save(profile));
    }
    @Transactional
    public void deleteByEmail(String email) {
        if (profileRepo.findByUserEmail(email).isEmpty())
            throw new IllegalArgumentException("Profile not found: " + email);
        profileRepo.deleteByUserEmail(email);
    }
    private ProfileDto toDto(Profile p) {
        ProfileDto dto = new ProfileDto();
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setPhone(p.getPhone());
        dto.setUserEmail(p.getUserEmail());
        return dto;
    }
}
