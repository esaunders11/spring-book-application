package com.esaunders.library.mappers;

import org.mapstruct.Mapper;

import com.esaunders.library.dtos.RegisterUser;
import com.esaunders.library.dtos.UserDto;
import com.esaunders.library.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(RegisterUser request);
    User toEntity(UserDto userDto);
}
