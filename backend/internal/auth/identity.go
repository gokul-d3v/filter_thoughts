package auth

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math/big"
	"time"
)

var adjectives = []string{"Silent", "Quiet", "Hidden", "Shadow", "Swift", "Brave", "Calm", "Fierce", "Noble", "Clever"}
var nouns = []string{"Fox", "Tiger", "Wolf", "Bear", "Hawk", "Owl", "Lynx", "Panther", "Falcon", "Raven"}

// GenerateUserID creates a random anonymous user ID, e.g., usr_8a3b1c...
func GenerateUserID() string {
	b := make([]byte, 12) // 24 hex chars
	if _, err := rand.Read(b); err != nil {
		// Fallback if crypto/rand fails
		return fmt.Sprintf("usr_%d", time.Now().UnixNano())
	}
	return "usr_" + hex.EncodeToString(b)
}

// GenerateDisplayName creates a random display name, e.g., SilentFox_4821
func GenerateDisplayName() string {
	adjIdx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(adjectives))))
	nounIdx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(nouns))))
	num, _ := rand.Int(rand.Reader, big.NewInt(9000))
	
	adj := adjectives[adjIdx.Int64()]
	noun := nouns[nounIdx.Int64()]
	return fmt.Sprintf("%s%s_%04d", adj, noun, num.Int64()+1000)
}
