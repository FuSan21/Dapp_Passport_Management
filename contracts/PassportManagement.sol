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
    
    // Array to store authorized admins
    address[] private admins;
    
    // Counter for passport IDs
    uint private passportIdCounter;
    
    // Events
    event PassportRegistered(address indexed user, uint passportId);
    
    constructor() {
        // Add contract deployer as the first admin
        admins.push(msg.sender);
        passportIdCounter = 1;
    }
    
    modifier onlyAdmin() {
        bool isAdminFlag = false;
        for(uint i = 0; i < admins.length; i++) {
            if(admins[i] == msg.sender) {
                isAdminFlag = true;
                break;
            }
        }
        require(isAdminFlag, "Only admin can perform this action");
        _;
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
    
    function verify(address _userAddress) public view returns (
        bool hasPassport,
        string memory name,
        uint age,
        uint birthdate,
        string memory country,
        uint passportId
    ) {
        require(
            msg.sender == _userAddress || isAdmin(msg.sender),
            "Unauthorized access"
        );
        
        Passport memory passport = passports[_userAddress];
        
        return (
            passport.exists,
            passport.name,
            passport.age,
            passport.birthdate,
            passport.country,
            passport.passportId
        );
    }
    
    function addAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admins.push(_newAdmin);
    }
    
    function isAdmin(address _address) private view returns (bool) {
        for(uint i = 0; i < admins.length; i++) {
            if(admins[i] == _address) {
                return true;
            }
        }
        return false;
    }
}