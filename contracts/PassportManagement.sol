// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract PassportManagement {
    struct Passport {
        string name;
        uint age;
        uint birthdate;
        string country;
        uint passportId;
        bool exists;
    }
    
    // Mapping from address to passport data
    mapping(address => Passport) private passports;
    
    // Single admin address
    address private admin;
    
    // Counter for passport IDs
    uint private passportIdCounter;
    
    // Events
    event PassportRegistered(address indexed user, uint passportId);
    
    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        admin = _admin;
        passportIdCounter = 1;
    }
    
    function register(
        string memory _name,
        uint _age,
        uint _birthdate,
        string memory _country
    ) public {
        require(!passports[msg.sender].exists, "Passport already exists for this address");
        
        Passport memory newPassport = Passport({
            name: _name,
            age: _age,
            birthdate: _birthdate,
            country: _country,
            passportId: passportIdCounter,
            exists: true
        });
        
        passports[msg.sender] = newPassport;
        passportIdCounter++;
        
        emit PassportRegistered(msg.sender, newPassport.passportId);
    }
    
    function verify(address _userAddress, uint _age) public view returns (
        bool hasPassport,
        string memory name,
        uint age,
        uint birthdate,
        string memory country,
        uint passportId
    ) {
        Passport memory passport = passports[_userAddress];
        require(passport.exists, "No passport found for this address");

        // Admin can verify without age check
        if (msg.sender == admin) {
            return (
                true,
                passport.name,
                passport.age,
                passport.birthdate,
                passport.country,
                passport.passportId
            );
        }
        
        // All other users (including passport owner) need correct age to verify
        require(passport.age == _age, "Invalid age provided");
        
        return (
            true,
            passport.name,
            passport.age,
            passport.birthdate,
            passport.country,
            passport.passportId
        );
    }
}