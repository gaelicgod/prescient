<?php
declare(strict_types=1);

use ForgetCache\Cache;
use PHPUnit\Framework\TestCase;

/**
 * PHPUnit TestCase for testing \ForgetCache\Cache
 * 
 * @category Testing
 * @package  Cache
 * @author   Bevan Christians <gaelicgod@gmail.com>
 * @license  https://opensource.org/licenses/MIT MIT
 */
final class CacheTest extends TestCase 
{
    /**
     * Setup function for phpunit
     *
     * @return void
     */
    public function setUp() 
    {
        $this->cache = new Cache(5);
        $values = array();
        for ($i = 0; $i < 5; $i++) {
            $values[$i] = "testValue_" . $i;
            $this->cache->set($i, $values[$i]);
        }
    }

    /**
     * Testing if Cache takes max size of 0
     *
     * @return void
     */
    public function testZeroFails() 
    {
        $this->expectException(InvalidArgumentException::class);
        $cache = new Cache(0);
    }

    /**
     * Testing if cache initializes with a negative number
     *
     * @return void
     */
    public function testNegativeValueFails() 
    {
        $this->expectException(InvalidArgumentException::class);
        $cache = new Cache(-10);
    }

    /**
     * Testing if a cache can be initialized with a string
     *
     * @return void
     */
    public function testStringFails() 
    {
        $this->expectException(TypeError::class);
        $cache = new Cache("hello");
    }

    /**
     * Testing if a cache can be initialized with a numeric string
     * note the strict type declaration has to be in the caller file, see above
     *
     * @return void
     */
    public function testNumericStringFails() 
    {
        $this->expectException(TypeError::class);
        $cache = new Cache("1");
    }

    /**
     * Checks that cache contains key 2
     *
     * @return void
     */
    public function testContainsTwo() 
    {
        $this->assertTrue($this->cache->hasKey(2));
    }

    /**
     * Test getting a key's value works
     *
     * @return void
     */
    public function testGetSucceeds() 
    {
        $this->assertSame("testValue_0", $this->cache->get(0));
    }
    
    /**
     * Test setting cache values
     *
     * @return void
     */
    public function testSetSucceeds() 
    {
        $this->cache->set(10, "hello");
        $this->assertSame("hello", $this->cache->get(10));

        // overwrite value
        $this->cache->set(10, "hello two");
        $this->assertSame("hello two", $this->cache->get(10));

        //exceed cache size
        $this->cache->set(11, "exceed");
        $this->assertSame("exceed", $this->cache->get(11));

        $this->assertFalse($this->cache->hasKey(1));
        $this->assertEquals(5, $this->cache->getCacheSize());

    }

    /**
     * Test cache update so LRU pattern works
     *
     * @return void
     */
    public function testCacheUpdate() 
    {
        $this->cache->set(20, "random value");
        $this->cache->get(1);
        $this->cache->set(21, "another random value");
        $this->assertTrue($this->cache->hasKey(1));
        $this->assertFalse($this->cache->hasKey(2));
    }

    /**
     * Test deleting a key
     *
     * @return void
     */
    public function testDeleteKey() 
    {
        $this->cache->deleteKey(4);
        $this->assertFalse($this->cache->hasKey(4));
        $this->assertEquals(4, $this->cache->getCacheSize());
    }

    /**
     * Test cache clearance
     *
     * @return void
     */
    public function testCacheClear() 
    {
        $this->cache->clearCache();
        $this->assertEquals(0, $this->cache->getCacheSize());
        $this->assertFalse($this->cache->hasKey(2));
    }
}