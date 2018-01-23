<?php


namespace ForgetCache;

/**
 * Cache Interface
 */
interface ICache
{
    /**
     * Retrieve a value based on the cache key
     *
     * @param int $key The cache key to retrieve
     * 
     * @return string
     */
    public function get(int $key);

    /**
     * Set a value to a key on the cache
     *
     * @param int    $key   The key for the cache
     * @param string $value The string we want to cache
     * 
     * @return void
     */
    public function set(int $key, string $value);

    /**
     * Checks if cache has key
     *
     * @param integer $key The key whose value we want to get
     * 
     * @return boolean
     */
    public function hasKey(int $key);

    /**
     * Gets the cache size
     *
     * @return int
     */
    public function getCacheSize();

    /**
     * Delete a key from the cache
     *
     * @param integer $key The key to delete from the cache
     * 
     * @return void
     */
    public function deleteKey(int $key);

    /**
     * Clears the cache
     *
     * @return void
     */
    public function clearCache();
}

/**
 * Cache class
 * This class uses a Least Recently Used (LRU) caching mechanism
 * 
 * @category Cache
 * @package  Cache
 * @author   Bevan Christians <gaelicgod@gmail.com>
 * @license  https://opensource.org/licenses/MIT MIT
 */
class Cache implements ICache 
{
    protected $data_cache;
    protected $max_cache_size;

    public function __construct(int $cache_size) 
    {
        $this->data_cache = array();
        if (is_int($cache_size) && $cache_size > 0) {
            $this->max_cache_size = $cache_size;
        } else {
            throw new \InvalidArgumentException("invalid cache size!");
        }
    }

    public function __clone()
    {
        throw new Exception("cloning is not allowed.");
    }

    /**
     * Retrieves the value of they key provided.
     * Sets the accessed key to the end of the cache array.
     * If it doesn't exist return NULL.
     *
     * @param integer $key The key of the cache value we want to return
     * 
     * @return string|null
     */
    public function get(int $key) 
    {
        if (isset($this->data_cache[$key])) {
            $this->moveKeyToEnd($key);

            return $this->data_cache[$key];
        }

        return null;
    }

    /**
     * Set a key and value in the cache.
     * If the key exists, set the new value and 
     * update the cache so that value moves to the 
     * end of the array
     *
     * @param integer $key   The cache key
     * @param string  $value The cache value
     * 
     * @return void
     */
    public function set(int $key, string $value) 
    {
        if(isset($this->data_cache[$key])) {
            $this->data_cache[$key] = $value;
            $this->moveKeyToEnd($key);
        } else {
            $this->data_cache[$key] = $value;
            if ($this->getCacheSize() > $this->max_cache_size) {
                // remove first element of array because max size is too high
                reset($this->data_cache);
                unset($this->data_cache[key($this->data_cache)]);
            }
        }
    }

    /**
     * Check if cache key exists
     *
     * @param integer $key The key we are looking for
     * 
     * @return boolean
     */
    public function hasKey(int $key) 
    {
        return isset($this->data_cache[$key]);
    }

    /**
     * Move the current key to the end of the array,
     * so if we need to reset it the keys are in FIFO order
     *
     * @param integer $key The cache key
     * 
     * @return void
     */
    protected function moveKeyToEnd(int $key) 
    {
        $value = $this->data_cache[$key];
        unset($this->data_cache[$key]);
        $this->data_cache[$key] = $value;
    }

    /**
     * Find the size of the cache;
     *
     * @return int
     */
    public function getCacheSize() 
    {
        return sizeof($this->data_cache);
    }

    /**
     * Gets the max cache size
     *
     * @return int
     */
    public function getMaxCacheSize() {
        return $this->max_cache_size;
    } 

    /**
     * Delete a key from the cache
     *
     * @param integer $key The key to delete from the cache
     * 
     * @return void
     */
    public function deleteKey(int $key) 
    {
        if (isset($this->data_cache[$key])) {
            unset($this->data_cache[$key]);
        }
    }

    /**
     * Completely trash the cache
     *
     * @return void
     */
    public function clearCache() 
    {
        $this->data_cache = array();
    }
}
