// SPDX-License-Identifier: MIT
pragma solidity 0.4.24;

import 'hardhat/console.sol';
import './Initializable.sol';

contract TotallySecureDapp is Initializable {
    struct Post {
        string title;
        string content;
    }

    string public _contractId;
    address public _owner;
    address[] public _authors;
    Post[] public _posts;

    event PostPublished(address indexed author, uint256 indexed index);
    event PostEdited(address indexed author, uint256 indexed index);
    event PostRemoved(address indexed author, uint256 indexed index);

    modifier onlyAdmin() {
        require(msg.sender == _owner, 'Caller is not an admin');
        _;
    }

    function initialize(string memory contractId) public initializer {
        _contractId = contractId;
        _owner = msg.sender;
    }

    function addPost(string title, string content) external {
        Post memory post = Post(title, content);
        _posts.push(post);
        _authors.push(msg.sender);
        emit PostPublished(msg.sender, _posts.length - 1);
    }

    function editPost(
        uint256 index,
        string title,
        string content
    ) external {
        _authors[index] = msg.sender;
        _posts[index] = Post(title, content);
        emit PostEdited(msg.sender, index);
    }

    function removePost(uint256 index) external {
        if (index < nPosts() - 1)
            for (uint256 i = index; i < _posts.length; i++) {
                _posts[i] = _posts[i + 1];
                _authors[i] = _authors[i + 1];
            }
        _posts.length--;
        _authors.length--;
        emit PostRemoved(msg.sender, index);
    }

    function nPosts() public view returns (uint256) {
        return _posts.length;
    }

    function doSomething() external onlyAdmin {
        console.log('something something');
    }
}
