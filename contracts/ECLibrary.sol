pragma solidity ^0.4.13;

contract ECLibrary {  // Electronic Certificate

    enum ECKind { 
        IDCard, 
        residencePermit, 
        visa,
        passport,
        householdRegister,
        militaryCard,
        membershipCard,
        partyMembershipCard,
        HongKongAndMacauPass
    }
    
    enum ECLevel {
        national,
        provincial,
        municipal,
        county,
        township
    }
    
    uint public ECIndex;
    mapping (address => mapping(uint => EC)) ownerships;
    mapping (uint => address) ECIdInLibrary;
    
    struct EC {
        string name;
        string num;
        string expirationDate;
        string cardUnit;
        string owner;
        string OFDLink;
        address ownerAddr;
        ECKind  kind;
        ECLevel level;
    }
    
    function ECLibrary() public {
        ECIndex = 0;
    }
    
    function addECToLibrary(
        string _name,
        string _num,
        string _expirationDate,
        string _cardUnit,
        string _owner,
        string _OFDLink,
        address _ownerAddr,
        ECKind _kind,
        ECLevel _level) 
        public
    {
        ECIndex += 1;
        EC memory ec = EC(_name, _num, _expirationDate, _cardUnit,
            _owner, _OFDLink, _ownerAddr, ECKind(_kind), ECLevel(_level));
        ownerships[_ownerAddr][ECIndex] = ec;
        ECIdInLibrary[ECIndex] = _ownerAddr;
    }
    
    function getEC(uint _ECId) view public returns (string, string, string, 
        string, string, string, ECKind, ECLevel)
    {
        EC memory ec = ownerships[ECIdInLibrary[_ECId]][_ECId];
        return (ec.name, ec.num, ec.expirationDate, ec.cardUnit, ec.owner,
                    ec.OFDLink, ec.kind, ec.level);
    }
}
